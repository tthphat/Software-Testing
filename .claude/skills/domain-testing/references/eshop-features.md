# EShop reference: FR-01, FR-03, FR-08, FR-12

Base URL: `http://localhost:3000`. Facts below come from `api_specification.md` and are tagged
`[SPEC]`. Everything under "Hypotheses to verify" is NOT a fact: confirm it in the `eshop-sut`
source code or by calling the API, then tag it `[CODE]` / `[OBSERVED]`, or keep it `[ASSUMED]`.

## FR-01 Account registration
- `[SPEC]` `POST /api/register`, JSON body `{ name, email, password }`.
- `[SPEC]` Success: HTTP 200 `{"message": "User registered successfully", "id": 1}`.
- `[SPEC]` Sample values: name `Nguyen Van A`, email `test@domain.com`, password `Password123!`.
- Input variables: `name`, `email`, `password`; state: email already registered.
- Outputs: success message + id; error responses (status + message) for each rejected class.
- Hypotheses to verify: name length min/max and allowed characters (Vietnamese diacritics?);
  email format and max length (RFC 5321 says 254), case sensitivity and trimming for
  duplicates; password min/max length and complexity (upper/lower/digit/special);
  whether `role` or `id` in the body is ignored or can be injected (mass assignment);
  whether the password is hashed; behaviour on missing/null/empty/non-string fields.

## FR-03 Forgot password and password reset (two steps)
- `[SPEC]` Step 1: `POST /api/forgot-password` body `{ email }`.
  Success 200 `{"message": "Ma dat lai mat khau da duoc tao", "resetToken": "123456"}`
  (the original message is Vietnamese; copy the exact text from a live response).
- `[SPEC]` Step 2: `POST /api/reset-password` body `{ email, resetToken, newPassword }`.
- Input variables: `email` (step 1), `email`, `resetToken`, `newPassword` (step 2);
  state: email registered or not, token issued/not issued, token expired, token already used,
  token belonging to another email.
- Outputs: token returned, success of reset, error responses; side effect: old password
  stops working and new password works for `POST /api/login`.
- Hypotheses to verify: token format (the sample is 6 digits) and whether length/charset is
  validated; token lifetime (expiry boundary in minutes); single-use; whether an unregistered
  email gets a different response than a registered one (user enumeration); `newPassword` rules
  equal to the registration rules or not; number of attempts allowed; whether returning
  `resetToken` in the response is intended (security observation, report as a note).

## FR-08 Checkout
- `[SPEC]` `POST /api/checkout` with header `Authorization: Bearer <token>`,
  body `{ total_amount, shipping_address }`, example `200000`, `"123 Le Loi, TP.HCM"`.
- `[SPEC]` Related: `GET /api/cart`, `POST /api/cart` body `{ id, name, price, quantity }`,
  `GET /api/orders/my-orders`, `GET /api/orders/:id`, `PUT /api/orders/:id/cancel`,
  `POST /api/apply-coupon` (not in scope unless the student adds FR-09).
- `[SPEC]` Order statuses: `pending, confirmed, shipping, delivered, canceled`.
- Input variables: `total_amount`, `shipping_address`, auth state, cart state (empty / has items),
  item `quantity` and `price` in the cart.
- Outputs: order created (id, status, total), error responses, side effects (cart emptied,
  order appears in my-orders with status `pending`).
- Hypotheses to verify: is `total_amount` recomputed server-side or trusted from the client
  (a classic defect: client sends a smaller amount); minimum/maximum amount; negative or zero
  amount; non-integer amount; address min/max length and emptiness; checkout with empty cart;
  checkout without token; quantity limits and stock checks in the cart; whether a second
  checkout with the same cart is possible.

## FR-12 Access control (Web Admin)
- `[SPEC]` Admin APIs require `Authorization: Bearer <token>` AND an Admin account:
  `GET/DELETE /api/admin/users[/:id]`, `GET /api/admin/orders`, `PUT /api/admin/orders/:id/status`,
  `POST /api/admin/import-products`, `POST/DELETE /api/admin/coupons[/:id]`,
  `GET /api/coupons` (admin), product and category create/update/delete (admin).
- Input variables (all state/context): token state (missing, malformed, tampered signature,
  expired, valid), role (guest, normal user, admin), target resource (admin endpoint vs
  public endpoint), HTTP method, UI route (web admin pages) vs API.
- Outputs: 401 vs 403 vs 200 (confirm which codes the SUT uses), redirect to login in the UI,
  no data leakage in error bodies.
- This feature is mostly a "set of values handled differently" case (roles) and a "must be"
  case (must carry a valid token). It has few ordered domains, so boundary value analysis
  applies only to token expiry time (if a `exp` claim exists). Say so in the report instead
  of forcing artificial boundaries.
- Hypotheses to verify: does a normal user get 403 on every `/api/admin/*` endpoint (test
  every endpoint, not a sample); can the user tamper the role inside the JWT; does
  `GET /api/coupons` really require admin; are product/category write endpoints protected;
  does the UI hide admin pages but the API stays open (UI-only protection); does a deleted
  user's old token still work.

## Test accounts and data (fill in from your local environment)
- normal user: `<email>` / `<password>` (create via FR-01)
- admin user: `<email>` / `<password>` (seed data or DB; check the repository README)
