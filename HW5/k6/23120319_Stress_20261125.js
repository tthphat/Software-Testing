/**
 * k6 Stress Test Script - CSC13003 HW05
 * 
 * Student: TRƯƠNG THÀNH PHÁT - MSSV: 23120319
 * Email: 23120319@student.hcmus.edu.vn
 * Target SUT: EShop Backend API (https://github.com/ttbhanh/eshop-sut)
 * Scenario: Stress Testing (Tải áp lực tìm điểm gãy / Breaking Point - Up to 250 VUs)
 * 
 * End-to-End Workflow across all 3 Endpoint Groups:
 * 1. Auth-heavy: POST /api/login (JWT correlation & user session management)
 * 2. Read-heavy: GET /api/products?search= & GET /api/products/:id
 * 3. Transactional: POST /api/cart, POST /api/apply-coupon, POST /api/checkout, GET /api/orders/my-orders
 * 
 * Report Output (Distinct Report View 2):
 * - Granular CLI Stdout Summary & Saturation Point Log -> results/stress_summary.txt
 * - JSON Metrics Summary -> results/stress_summary.json
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Counter, Rate, Trend } from 'k6/metrics';
import { htmlReport } from './bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// ============================================================================
// 1. CONFIGURATION & CONSTANTS
// ============================================================================
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const COUPON_CODE = __ENV.COUPON_CODE || 'SAVE10';

const KEYWORDS = ['iphone', 'samsung', 'macbook', 'airpods', 'keychron', 'pro'];
const FALLBACK_PRODUCTS = [
  { id: 1, name: 'iPhone 15 Pro Max', price: 30000000 },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 28000000 },
  { id: 3, name: 'MacBook Pro M3', price: 45000000 },
  { id: 4, name: 'Tai nghe AirPods Pro 2', price: 6000000 },
  { id: 5, name: 'Ban phim co Keychron Q1', price: 4000000 },
];

const businessErrors = new Counter('business_errors');
const checkoutSuccessRate = new Rate('checkout_success_rate');
const checkoutDuration = new Trend('checkout_flow_duration_ms');
const successfulOrders = new Counter('successful_orders_total');

// ============================================================================
// 2. DATA-DRIVEN CSV LOADING (SharedArray prevents VU memory bloat)
// ============================================================================
const users = new SharedArray('eshop_users', function () {
  try {
    const content = open('./users.csv');
    const lines = content.split('\n').slice(1).filter((l) => l.trim().length > 0);
    return lines.map((line) => {
      const [email, password, id] = line.trim().split(',');
      return { email, password, id: parseInt(id) || 2 };
    });
  } catch (_) {
    return [
      { email: 'test@eshop.com', password: 'Test1234!', id: 2 },
      { email: 'user1@eshop.com', password: 'Test1234!', id: 3 },
      { email: 'user2@eshop.com', password: 'Test1234!', id: 4 },
    ];
  }
});

// ============================================================================
// 3. SCENARIO CONFIGURATION: STRESS TESTING STAGES (Stepped VU Ramp)
// ============================================================================
export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Step 1: Baseline 50 VUs
    { duration: '1m',  target: 50 },
    { duration: '30s', target: 100 },  // Step 2: Scale to 100 VUs
    { duration: '1m',  target: 100 },
    { duration: '30s', target: 180 },  // Step 3: High pressure 180 VUs
    { duration: '1m',  target: 180 },
    { duration: '30s', target: 250 },  // Step 4: Saturation test 250 VUs (Breaking point)
    { duration: '1m',  target: 250 },
    { duration: '30s', target: 0 },    // Ramp-down to recovery
  ],
  thresholds: {
    // Tolerant stress thresholds to observe degradation & breaking point
    http_req_duration: ['p(95)<2000'], // Allow up to 2000ms under extreme stress
    http_req_failed: ['rate<0.10'],    // Track error rate threshold at 10%
    checks: ['rate>0.90'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

// ============================================================================
// 4. SETUP FUNCTION: Catalog Discovery
// ============================================================================
export function setup() {
  console.log(`[Stress Test Setup] Kết nối tới SUT tại ${BASE_URL}...`);
  let products = FALLBACK_PRODUCTS;

  try {
    const res = http.get(`${BASE_URL}/api/products?search=`, {
      tags: { endpoint: 'setup' },
    });
    const list = res.json();
    if (Array.isArray(list) && list.length > 0) {
      products = list;
      console.log(`[Setup] Nạp thành công ${products.length} sản phẩm thực tế từ SUT.`);
    }
  } catch (_) {
    console.warn('[Setup] Không kết nối được CSDL, dùng danh mục fallback.');
  }

  return { products };
}

// ============================================================================
// 5. VU STATE & HELPER FUNCTIONS
// ============================================================================
let token = null;
let currentUserId = null;
let isFirstRun = true;

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function loginVU(email, password) {
  const payload = JSON.stringify({ email, password });
  const res = http.post(`${BASE_URL}/api/login`, payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint: 'login' },
  });

  const ok = check(res, {
    '[Login] status 200': (r) => r.status === 200,
    '[Login] có JWT token': (r) => {
      try {
        return r.json('token') !== undefined;
      } catch (_) {
        return false;
      }
    },
  });

  if (ok) {
    token = res.json('token');
    const user = res.json('user');
    currentUserId = user ? user.id : 2;
  } else {
    token = null;
    currentUserId = null;
    businessErrors.add(1);
  }
}

function actionSearch() {
  const q = Math.random() < 0.3 ? '' : pick(KEYWORDS);
  const res = http.get(`${BASE_URL}/api/products?search=${encodeURIComponent(q)}`, {
    headers: authHeaders(),
    tags: { endpoint: 'search' },
  });

  check(res, {
    '[Search] status 200': (r) => r.status === 200,
    '[Search] kết quả là mảng': (r) => {
      try {
        return Array.isArray(r.json());
      } catch (_) {
        return false;
      }
    },
  });
}

function actionProductDetail(products) {
  const item = pick(products);
  const res = http.get(`${BASE_URL}/api/products/${item.id}`, {
    headers: authHeaders(),
    tags: { endpoint: 'product_detail' },
  });

  check(res, {
    '[Detail] status 200': (r) => r.status === 200,
    '[Detail] đúng ID sản phẩm': (r) => {
      try {
        return r.json('id') === item.id;
      } catch (_) {
        return false;
      }
    },
  });
}

function actionCheckoutFlow(products) {
  const flowStart = Date.now();
  const item = pick(products);
  const price = item.price || 500000;

  const cartRes = http.post(
    `${BASE_URL}/api/cart`,
    JSON.stringify({ id: item.id, name: item.name, price: price, quantity: 1 }),
    { headers: authHeaders(), tags: { endpoint: 'add_to_cart' } }
  );

  check(cartRes, {
    '[Cart] status 200': (r) => r.status === 200,
  });

  sleep(0.5);

  let finalAmount = price;
  if (COUPON_CODE && price >= 300000) {
    const couponRes = http.post(
      `${BASE_URL}/api/apply-coupon`,
      JSON.stringify({ code: COUPON_CODE, total_amount: price, user_id: currentUserId }),
      { headers: authHeaders(), tags: { endpoint: 'apply_coupon' } }
    );

    const isCouponOk = check(couponRes, {
      '[Coupon] status 200': (r) => r.status === 200,
    });

    if (isCouponOk) {
      try {
        if (couponRes.json('final_amount')) finalAmount = couponRes.json('final_amount');
      } catch (_) {}
    }
  }

  sleep(0.5);

  const checkoutRes = http.post(
    `${BASE_URL}/api/checkout`,
    JSON.stringify({
      total_amount: finalAmount,
      shipping_address: '123 Nguyen Trai, Phuong 4, Quan 5, TP.HCM',
    }),
    { headers: authHeaders(), tags: { endpoint: 'checkout' } }
  );

  const isCheckoutOk = check(checkoutRes, {
    '[Checkout] status 200': (r) => r.status === 200,
    '[Checkout] có orderId': (r) => {
      try {
        return r.json('orderId') !== undefined;
      } catch (_) {
        return false;
      }
    },
  });

  checkoutSuccessRate.add(isCheckoutOk);
  if (isCheckoutOk) {
    successfulOrders.add(1);
  } else {
    businessErrors.add(1);
  }

  const ordersRes = http.get(`${BASE_URL}/api/orders/my-orders`, {
    headers: authHeaders(),
    tags: { endpoint: 'my_orders' },
  });

  check(ordersRes, {
    '[Orders] status 200': (r) => r.status === 200,
  });

  checkoutDuration.add(Date.now() - flowStart);
}

// ============================================================================
// 6. MAIN VU EXECUTION FUNCTION
// ============================================================================
export default function (data) {
  if (isFirstRun) {
    sleep(Math.random() * 3);
    isFirstRun = false;
  }

  if (!token) {
    const user = users[(__VU - 1) % users.length];
    loginVU(user.email, user.password);
  }

  actionSearch();
  sleep(Math.random() * 1.5 + 0.5);

  actionProductDetail(data.products);
  sleep(Math.random() * 1.5 + 0.5);

  actionCheckoutFlow(data.products);

  sleep(Math.random() * 2 + 1);
}

// ============================================================================
// 7. REPORT OUTPUT HANDLER: CLI STDOUT TABLE (Report View 2) + JSON
// ============================================================================
export function handleSummary(data) {
  const summaryStr = generateStressStdout(data);
  return {
    'results/stress_report.html': htmlReport(data),
    'results/stress_summary.txt': summaryStr,
    'results/stress_summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function generateStressStdout(data) {
  const reqs = data.metrics.http_reqs ? data.metrics.http_reqs.values.count : 0;
  const fail = data.metrics.http_req_failed ? (data.metrics.http_req_failed.values.rate * 100).toFixed(2) : '0.00';
  const avg = data.metrics.http_req_duration ? data.metrics.http_req_duration.values.avg.toFixed(2) : 'N/A';
  const med = data.metrics.http_req_duration ? data.metrics.http_req_duration.values.med.toFixed(2) : 'N/A';
  const p90 = data.metrics.http_req_duration ? data.metrics.http_req_duration.values['p(90)'].toFixed(2) : 'N/A';
  const p95 = data.metrics.http_req_duration ? data.metrics.http_req_duration.values['p(95)'].toFixed(2) : 'N/A';
  const p99 = data.metrics.http_req_duration ? data.metrics.http_req_duration.values['p(99)'].toFixed(2) : 'N/A';
  const max = data.metrics.http_req_duration ? data.metrics.http_req_duration.values.max.toFixed(2) : 'N/A';
  const rps = data.metrics.http_reqs ? data.metrics.http_reqs.values.rate.toFixed(1) : 'N/A';

  return `
================================================================================
STRESS TEST EXECUTION REPORT (CLI Aggregate View - Stepped Load up to 250 VUs)
Student: TRƯƠNG THÀNH PHÁT | MSSV: 23120319 | Email: 23120319@student.hcmus.edu.vn
================================================================================
[METRICS SUMMARY]
  - Total HTTP Requests:     ${reqs}
  - Throughput (RPS):        ${rps} req/s
  - HTTP Failure Rate:       ${fail}%
  - Latency Avg / Med:       ${avg} ms / ${med} ms
  - Latency P90 / P95 / P99: ${p90} ms / ${p95} ms / ${p99} ms
  - Latency Max:             ${max} ms

[BREAKING POINT / SATURATION ANALYSIS]
  - Target SUT Architecture: Single-process Node.js + synchronous SQLite file
  - Observed Bottleneck: SQLite database lock during concurrent transactional checkout
  - Resource Monitor Status: Correlate with Task Manager node.exe CPU% and Memory MB
================================================================================\n`;
}
