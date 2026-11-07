#!/usr/bin/env node

/**
 * calculate_sus.mjs
 * Script tính điểm System Usability Scale (SUS) chuẩn mực theo phương pháp của John Brooke (1996)
 * và thang đo Bangor et al. (2008).
 * 
 * Cách dùng:
 *   node calculate_sus.mjs [path_to_data.json]
 */

import fs from 'fs';
import path from 'path';

// Mẫu dữ liệu mặc định cho 7 người tham gia nếu không truyền file
const defaultParticipants = [
  { id: 'P01', name: 'Nguyễn Văn A', contact: '0903****12', timeSec: 95, success: true, answers: [4, 2, 4, 1, 4, 2, 5, 2, 4, 2] },
  { id: 'P02', name: 'Trần Thị B', contact: '0912****56', timeSec: 130, success: true, answers: [3, 3, 4, 2, 3, 2, 4, 3, 3, 2] },
  { id: 'P03', name: 'Lê Hoàng C', contact: '0988****78', timeSec: 110, success: true, answers: [5, 1, 5, 1, 4, 1, 5, 1, 4, 1] },
  { id: 'P04', name: 'Phạm Minh D', contact: '0934****90', timeSec: 145, success: true, answers: [3, 2, 3, 3, 3, 3, 4, 2, 3, 3] },
  { id: 'P05', name: 'Võ Thanh E', contact: '0977****34', timeSec: 85, success: true, answers: [4, 1, 4, 2, 4, 1, 5, 2, 4, 1] },
  { id: 'P06', name: 'Đặng Quốc F', contact: '0945****67', timeSec: 160, success: true, answers: [3, 4, 3, 3, 3, 3, 3, 3, 2, 3] },
  { id: 'P07', name: 'Bùi Thu G', contact: '0966****89', timeSec: 105, success: true, answers: [4, 2, 4, 1, 5, 2, 4, 2, 4, 2] }
];

function getGrade(score) {
  if (score >= 80.3) return { grade: 'A', adjective: 'Excellent', acceptability: 'Acceptable' };
  if (score >= 68.0) return { grade: 'B', adjective: 'Good', acceptability: 'Acceptable' };
  if (score >= 51.0) return { grade: 'C', adjective: 'OK', acceptability: 'Marginal' };
  if (score >= 36.0) return { grade: 'D', adjective: 'Poor', acceptability: 'Marginal' };
  return { grade: 'F', adjective: 'Worst Imaginable', acceptability: 'Not Acceptable' };
}

function calculateIndividualSUS(answers) {
  if (!answers || answers.length !== 10) {
    throw new Error('Mỗi người tham gia phải có đúng 10 câu trả lời (Q1 -> Q10)');
  }
  let oddSum = 0;
  let evenSum = 0;

  for (let i = 0; i < 10; i++) {
    const val = Number(answers[i]);
    if (i % 2 === 0) {
      // Câu lẻ (index 0, 2, 4, 6, 8 -> Q1, Q3, Q5, Q7, Q9): val - 1
      oddSum += (val - 1);
    } else {
      // Câu chẵn (index 1, 3, 5, 7, 9 -> Q2, Q4, Q6, Q8, Q10): 5 - val
      evenSum += (5 - val);
    }
  }

  return (oddSum + evenSum) * 2.5;
}

function runAnalysis(participants) {
  console.log('========================================================================================');
  console.log('📊 SYSTEM USABILITY SCALE (SUS) ANALYSIS REPORT (CSC13003 S13)');
  console.log('========================================================================================\n');

  const scores = [];
  const times = [];
  let successfulTasks = 0;

  console.log('| ID | Họ và tên | SĐT/Zalo | Thời gian (s) | Hoàn thành | Điểm SUS | Xếp loại (Grade) | Đánh giá tính từ |');
  console.log('|:--:|:---|:---:|:---:|:---:|:---:|:---:|:---|');

  for (const p of participants) {
    const sus = calculateIndividualSUS(p.answers);
    scores.push(sus);
    times.push(p.timeSec);
    if (p.success) successfulTasks++;

    const gradeInfo = getGrade(sus);
    console.log(`| ${p.id} | ${p.name} | ${p.contact} | ${p.timeSec}s | ${p.success ? 'Thành công' : 'Thất bại'} | **${sus.toFixed(1)}** | Grade ${gradeInfo.grade} | ${gradeInfo.adjective} |`);
  }

  // Thống kê mô tả
  const n = scores.length;
  const meanSUS = scores.reduce((a, b) => a + b, 0) / n;
  const sortedScores = [...scores].sort((a, b) => a - b);
  const medianSUS = n % 2 === 0 ? (sortedScores[n/2 - 1] + sortedScores[n/2]) / 2 : sortedScores[Math.floor(n/2)];
  
  // Độ lệch chuẩn (Standard Deviation)
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - meanSUS, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);

  // Thời gian trung bình
  const meanTime = times.reduce((a, b) => a + b, 0) / n;

  const overallGrade = getGrade(meanSUS);

  console.log('\n----------------------------------------------------------------------------------------');
  console.log('📈 TỔNG HỢP KẾT QUẢ ĐO LƯỜNG (METRICS SUMMARY):');
  console.log('----------------------------------------------------------------------------------------');
  console.log(`• Tổng số người tham gia (Sample Size): ${n}`);
  console.log(`• Tỷ lệ hoàn thành nhiệm vụ (Completion Rate): ${(successfulTasks / n * 100).toFixed(1)}%`);
  console.log(`• Thời gian hoàn thành trung bình (Mean Time): ${meanTime.toFixed(1)} giây (Benchmark: 120s)`);
  console.log(`• Điểm SUS trung bình (Mean SUS): **${meanSUS.toFixed(2)} / 100**`);
  console.log(`• Trung vị SUS (Median SUS): ${medianSUS.toFixed(2)}`);
  console.log(`• Độ lệch chuẩn (Standard Deviation): ±${stdDev.toFixed(2)}`);
  console.log(`• Điểm thấp nhất / cao nhất (Range): ${Math.min(...scores).toFixed(1)} - ${Math.max(...scores).toFixed(1)}`);
  console.log(`• Chuẩn ngành (Industry Benchmark): 68.0`);
  console.log(`• Xếp loại tổng thể (Bangor Grade): **Grade ${overallGrade.grade}** (${overallGrade.adjective}) - ${overallGrade.acceptability}`);
  console.log('========================================================================================\n');
}

// Chạy script
const dataFile = process.argv[2];
let data = defaultParticipants;

if (dataFile && fs.existsSync(dataFile)) {
  try {
    data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (err) {
    console.error(`Lỗi khi đọc file ${dataFile}:`, err.message);
    process.exit(1);
  }
}

runAnalysis(data);
