# HW03 – GUI & Usability (bản dịch tiếng Việt)

## 1. Thông tin chung

| Mục | Nội dung |
|---|---|
| Mã bài tập | HW03-AI |
| Thời lượng | 10 giờ |
| Hạn nộp | Xem link nộp bài trên Moodle |
| Hình thức | Bài tập cá nhân |
| Nộp bài | Moodle (báo cáo) |
| Giảng viên & Trợ giảng | TS. Lâm Quang Vũ / TS. Trần Duy Hoàng / ThS. Trần Thị Bích Hạnh / ThS. Trương Phước Lộc / ThS. Hồ Tuấn Thanh |
| Liên hệ | lqvu@fit.hcmus.edu.vn / tdhoang@fit.hcmus.edu.vn / ttbhanh@fit.hcmus.edu.vn / tploc@fit.hcmus.edu.vn / hthanh@fit.hcmus.edu.vn |
| Chính sách AI | Mở (Open): bắt buộc có bản khai báo và đính kèm Báo cáo kiểm toán AI (AI Audit Report) |
| Mức Bloom-AI yêu cầu | G9.1 → G9.6, tùy từng bài tập (xem bảng CLO Mapping) |

## 2. Nguyên tắc chỉ đạo

Các nguyên tắc này xác định cách bạn được kỳ vọng làm việc xuyên suốt chuỗi bài tập của môn học. Hãy đọc kỹ trước khi bắt đầu, vì bài nộp của bạn sẽ được đánh giá dựa trên chúng.

**Chiến lược AI-First.** Bạn bắt buộc phải áp dụng AI vào các kỹ thuật kiểm thử đã học trên lớp. Tuy nhiên, điều này không có nghĩa là đưa ra một prompt chung chung duy nhất, chẳng hạn "hãy tạo checklist GUI và tìm các vấn đề usability trong ứng dụng này". Thay vào đó, bạn phải dẫn dắt AI đi qua từng bước của kỹ thuật theo đúng cách đã được dạy, sử dụng AI như một trợ lý có kỷ luật chứ không phải một "hộp đen".

**Con người kiểm tra lại (Human review).** Mọi kết quả do AI tạo ra đều phải được bạn, sinh viên, xem xét cẩn thận. Bạn hoàn toàn chịu trách nhiệm về tính đúng đắn của các kết quả này. Bạn phải thực hiện mọi chỉnh sửa và tinh chỉnh cần thiết; nộp nguyên đầu ra thô của AI mà không review là không được chấp nhận.

**Báo cáo kiểm toán AI (AI Audit Report).** Toàn bộ quá trình sử dụng AI phải được ghi lại trong một nhật ký đầy đủ. Bạn được khuyến khích xây dựng các Agent Skill có thể tự động thực hiện các hoạt động này trên những bài tập tương tự. Nếu bạn không dùng AI, bạn vẫn phải khai báo rõ ràng điều đó.

**Tài liệu hóa (Documentation).** Toàn bộ quá trình làm việc phải được ghi lại bằng định dạng văn bản như Markdown.

**Chất lượng hơn hoàn thành.** Bài làm của bạn sẽ được chấm không chỉ dựa trên việc có đầy đủ hay không, mà còn dựa trên số lượng và chất lượng của các sản phẩm: checklist, thiết kế và phân tích đánh giá usability, báo cáo bug, ảnh chụp màn hình, danh sách người tham gia và các link tham chiếu.

## 3. Chuẩn đầu ra

Sau khi hoàn thành bài tập này, bạn sẽ có thể:

- Thiết kế và áp dụng một checklist GUI cùng với đánh giá usability dựa trên các yêu cầu giao diện người dùng của SUT.
- Thu thập và phân tích phản hồi usability từ người dùng thật.
- Thực hiện kiểm thử đa trình duyệt và đa nền tảng trên frontend web và ứng dụng di động của SUT.
- Thể hiện năng lực Bloom-AI ở mức G9.3 (Phân tích) và G9.4 (Cộng tác với AI để kiểm thử thăm dò).

## 4. Hệ thống được kiểm thử (SUT)

**SUT:** EShop, một ứng dụng thương mại điện tử demo của Việt Nam được thiết kế để thực hành kiểm thử.

**Repository:** https://github.com/ttbhanh/eshop-sut

Các tính năng của ứng dụng được chia thành các nhóm (pool) sau:

**Pool A – Xác thực, Danh mục và Sản phẩm**
- FR-01: Đăng ký tài khoản
- FR-02: Đăng nhập và khóa tài khoản
- FR-03: Quên mật khẩu và đặt lại mật khẩu (hai bước)
- FR-04: Quản lý hồ sơ cá nhân
- FR-05: Danh sách sản phẩm và tìm kiếm
- FR-06: Xem chi tiết sản phẩm

**Pool B – Giỏ hàng và Thanh toán**
- FR-07: Giỏ hàng
- FR-08: Thanh toán (Checkout)
- FR-09: Mã giảm giá (coupon)
- FR-10: Máy trạng thái đơn hàng
- FR-11: Xem lịch sử đơn hàng (người dùng)

**Pool C – Web Admin**
- FR-12: Kiểm soát truy cập
- FR-13: Dashboard
- FR-14: Quản lý danh mục (CRUD)
- FR-15: Quản lý sản phẩm (CRUD)
- FR-16: Nhập sản phẩm từ CSV
- FR-17: Quản lý coupon (CRUD)
- FR-18: Quản lý đơn hàng (admin)
- FR-19: Quản lý người dùng (admin)

**Pool D – Ứng dụng di động (Mobile App)**

Ngoài các yêu cầu chức năng ở trên, bài tập này tập trung vào giao diện người dùng. Đặc tả không gán mã FR cho các mối quan tâm về giao diện, vì vậy trong bài tập này chúng được tổ chức thành các **khía cạnh giao diện (Interface Aspect – IA)** sau. Các ID này được định nghĩa ở đây để bạn tham chiếu trong checklist; chúng là các khía cạnh giao diện cần kiểm thử, không phải các yêu cầu chức năng có đánh số.

- IA-01: Chuẩn UI chung
- IA-02: Form (biểu mẫu)
- IA-03: Điều hướng
- IA-04: Phản hồi / trạng thái

## 5. Lựa chọn phạm vi

Bài tập này nhắm vào giao diện người dùng của SUT. Bạn có thể chọn màn hình nào và luồng người dùng nào để làm, với điều kiện đáp ứng mức tối thiểu nêu trong từng task.

**Với checklist GUI**, bạn có thể chọn một hoặc nhiều màn hình của SUT (ví dụ: Home, Cart, Checkout, Admin Dashboard hoặc một màn hình Mobile). Mức tối thiểu là một màn hình, nhưng một màn hình đơn lẻ sẽ khó cho ra 40 mục checklist có ý nghĩa; bạn được khuyến khích mạnh mẽ nên phủ nhiều màn hình để đạt độ bao phủ giao diện đầy đủ. Kiểm thử một màn hình duy nhất là được phép nhưng nhiều khả năng sẽ tạo ra các mục nông hoặc lặp lại.

**Với đánh giá usability**, hãy chọn một luồng end-to-end (ví dụ: Đăng ký → Thêm vào giỏ → Thanh toán với coupon); luồng này trở thành kịch bản nhiệm vụ mà những người tham gia sẽ thực hiện trong Task 2.

Trong cùng một nhóm, hãy đảm bảo lựa chọn của bạn không trùng lặp giữa các thành viên: không có hai thành viên nào được chọn cùng một màn hình chính cho checklist GUI hoặc cùng một luồng usability.

## 6. Yêu cầu

Với mỗi task dưới đây, hãy ghi lại quy trình thực hiện trong báo cáo chính và đính kèm bằng chứng cần thiết.

### Task 1 – Checklist GUI

- Thiết kế một checklist **hơn 40 mục** bao phủ cả bốn khía cạnh giao diện của SUT: chuẩn UI chung (IA-01), form (IA-02), điều hướng (IA-03) và phản hồi / trạng thái (IA-04). Hãy xem lại các bài giảng của môn học về checklist GUI trước khi bắt đầu. Dùng một công cụ AI để tạo bộ mục ban đầu, sau đó review và bổ sung thêm các mục của riêng bạn. Bạn được khuyến khích vượt mức tối thiểu: độ bao phủ càng kỹ lưỡng và càng ít lặp lại thì càng tốt.
- Review một cách phản biện các mục do AI tạo ra và bổ sung vào checklist mọi mục mà AI đã bỏ sót. Với mỗi mục bạn thêm, hãy giải thích **vì sao AI bỏ sót**, ví dụ: do chất lượng prompt đầu vào, do giới hạn của mô hình AI, hoặc do đặc thù của giao diện bạn chọn để kiểm thử. Những mục AI thường bỏ qua gồm khả năng truy cập (accessibility), bố cục phải-sang-trái (RTL) và chế độ tối (dark mode), nhưng đây chỉ là các ví dụ; bạn tự do thêm bất kỳ khía cạnh nào mà AI đã bỏ sót.
- **Thực thi checklist** trên SUT (giai đoạn thực thi kiểm thử), đánh dấu từng mục là Passed hoặc Failed. Thêm cột **Notes** vào checklist để ghi lý do thất bại cho mỗi mục Failed. **Chỉ đính kèm ảnh chụp màn hình cho các mục Failed.**
- Báo cáo tất cả bug phát hiện được cả trong báo cáo Markdown **và** trên trang **GitHub Issues** của bạn. Nhớ đính kèm ảnh chụp bug vào từng issue trên GitHub.

### Task 2 – Đánh giá Usability

Bạn sẽ thực hiện một đợt đánh giá usability quy mô nhỏ, có người điều phối (moderated), trên luồng end-to-end duy nhất bạn đã chọn ở §5, với **bảy (7) người tham gia thật** (bảy phiên, mỗi người một phiên). Hãy xem lại các bài giảng của môn học về đánh giá usability trước khi bắt đầu.

**Giai đoạn 1 – Lập kế hoạch & chuẩn bị**

- **Xác định mục tiêu.** Nêu rõ bạn muốn tìm hiểu điều gì, ví dụ: người dùng gặp nút thắt điều hướng ở đâu trên luồng đã chọn, hoặc họ cảm thấy tự tin đến mức nào khi hoàn thành luồng đó.
- **Viết kịch bản nhiệm vụ.** Biến luồng bạn chọn thành một kịch bản thực tế, hướng đến mục tiêu (ví dụ: "Tìm một chiếc áo khoác mùa đông dưới 500.000 ₫ và thanh toán bằng mã giảm giá"). Hãy đưa cho người tham gia một mục tiêu, không phải hướng dẫn từng bước.
- **Chuẩn bị công cụ đo.** Một thang đo usability chuẩn để điền sau mỗi phiên: SUS hoặc UEQ-S (hoặc một thang đo tùy chỉnh kèm lời biện minh bằng văn bản rõ ràng), cùng với một bộ câu hỏi thăm dò (probe) mở ngắn gọn, tối thiểu bao gồm: **tính rõ ràng, khôi phục lỗi, tốc độ và sự tin cậy**.
- **Tuyển bảy (7) người tham gia thật** phù hợp với hồ sơ người dùng mục tiêu của bạn, có thông tin liên hệ có thể xác minh (Zalo, email hoặc số điện thoại, che bốn chữ số ở giữa). Người tham gia phải là người **ngoài lớp**: sinh viên đang theo học HW03 không đủ điều kiện. Người tham gia không thuộc ngành IT / không phải tester được ưu tiên để có phản hồi usability chân thực, dù điều này không bắt buộc tuyệt đối.
- **Chạy một phiên thử (pilot)** với một người để phát hiện kịch bản chưa rõ, luồng bị lỗi hoặc vấn đề về thời gian; chỉnh sửa trước khi chạy các phiên chính thức.

**Giai đoạn 2 – Tiến hành các phiên (mỗi người tham gia một phiên)**

- **Dàn dựng bối cảnh.** Nói với người tham gia rằng bạn đang kiểm thử sản phẩm chứ không phải kiểm thử họ, và đề nghị họ nói to suy nghĩ (think aloud) khi làm.
- **Quan sát trung lập.** Không đưa gợi ý dẫn dắt hay giải thích giao diện; chỉ can thiệp khi người tham gia hoàn toàn bị kẹt.
- **Thu thập bằng chứng.** Ghi lại màn hình (và âm thanh, khi có sự đồng ý) và ghi chú có cấu trúc về các điểm vướng mắc, lỗi, sự ngập ngừng và lời phàn nàn bằng lời.
- **Kết thúc phiên.** Cho người tham gia hoàn thành thang đo SUS / UEQ-S, sau đó hỏi các câu probe để đào sâu vào những khó khăn bạn đã quan sát.

**Giai đoạn 3 – Phân tích & báo cáo**

- Tính điểm SUS / UEQ-S trên bảy người tham gia.
- Tổng hợp ghi chú: gom nhóm các pain point tương tự, và tách các bug đơn lẻ khỏi các vấn đề thiết kế mang tính hệ thống.
- Ưu tiên theo mức độ nghiêm trọng (ví dụ: lỗi chặn hoàn thành nhiệm vụ so với phàn nàn nhỏ về hình thức).
- Báo cáo các bug thật cả trong báo cáo Markdown **và** trên trang GitHub Issues của bạn, kèm ảnh chụp màn hình trong mỗi issue.

**TA có thể gọi ngẫu nhiên hai (2) người tham gia để xác minh. Mạo danh sẽ bị 0 điểm cho Task 2.**

### Task 3 – Đa trình duyệt / Đa nền tảng

- Thực hiện Task 1 trên **ít nhất ba (3) nền tảng**.
- Dùng bản dùng thử BrowserStack hoặc LambdaTest; hai công cụ này được ưu tiên mạnh. Nếu bản dùng thử đã hết hạn, bạn có thể thay bằng công cụ kiểm thử đám mây khác (ví dụ Sauce Labs hoặc CrossBrowserTesting) hoặc dùng thiết bị vật lý thật, với điều kiện ảnh chụp màn hình của bạn thể hiện rõ tên trình duyệt / hệ điều hành / thiết bị cùng với URL localhost của SUT. Bạn tự chịu trách nhiệm có được quyền truy cập bản dùng thử.
- Bao phủ web frontend trên Chrome, Firefox và Safari (hoặc Chrome trên Android).
- Bạn cũng có thể kiểm thử ứng dụng di động của SUT qua Expo Go trên điện thoại thật. Expo Go được tính là một nền tảng hợp lệ và có thể thay thế một trong ba nền tảng trình duyệt bắt buộc (ví dụ thay cho Safari); nó không chỉ là phần thưởng thêm: sử dụng nó thỏa mãn một trong ba nền tảng bắt buộc.
- Mỗi ảnh chụp màn hình phải được **overlay username** của bạn theo dạng email sinh viên.

## 7. Agent Skill

Bạn được khuyến khích xây dựng các Agent Skill áp dụng các hoạt động checklist GUI và đánh giá usability, để có thể tái sử dụng trên các màn hình và luồng bổ sung trong các nhiệm vụ kiểm thử sau này. Hãy nộp các skill cùng với video demo (link YouTube) thể hiện từ đầu đến cuối cách bạn dùng các skill này trên một màn hình hoặc luồng hoàn chỉnh.

## 8. Công cụ được phép và mức Bloom-AI

Bạn có thể dùng các công cụ sau, và phải khai báo chúng trong Báo cáo kiểm toán AI:

- Bất kỳ công cụ AI nào bạn chọn (ví dụ: ChatGPT, Claude, Gemini, Copilot, Cursor).
- Bản dùng thử BrowserStack hoặc LambdaTest.

Mức Bloom-AI yêu cầu cho bài tập này là **G9.3 (Phân tích)** và **G9.4 (Cộng tác)**.

## 9. Báo cáo kiểm toán AI (Phụ lục bắt buộc)

Đính kèm Báo cáo kiểm toán AI làm phụ lục. Sử dụng nội dung của các Mẫu AI (AI Templates) được cung cấp nếu cần.

- Nếu bạn không dùng AI, hãy khai báo: *"I do not use any AI help in this exercise."*
- Nếu bạn có dùng AI, hãy khai báo: *"I use AI tools for the following tasks,"* và ghi kèm các thông tin sau cho mỗi lần tương tác:
  - Tên công cụ AI
  - Ngày và giờ
  - Prompt của bạn
  - Đầu ra của AI

Để đơn giản hóa quá trình này, bạn được khuyến khích tạo một skill hoặc rule tự động trích xuất các thông tin trên sau mỗi phiên làm việc với AI.

## 10. Phản biện AI (AI Critique) (200–300 từ, bắt buộc)

Viết một đoạn văn từ 200–300 từ phê bình AI. Hãy trả lời các câu hỏi sau: AI đã sai, thiên lệch hoặc thiếu sót ở đâu? Vì sao nó không phát hiện được vấn đề? Bạn đã học được nguyên tắc nào về việc cộng tác với AI trong bài tập này?

Sử dụng nội dung của các Mẫu AI được cung cấp nếu cần.

## 11. Ràng buộc chống gian lận bằng AI

Bài tập này dựa vào những người tham gia thật và các lần chạy đa nền tảng thật. Những nội dung sau **không được** do AI tạo ra hoặc bịa đặt, và các TA sẽ xác minh chúng khi chấm:

- Danh sách 7 người tham gia (họ tên cùng Zalo / số điện thoại, che bốn chữ số ở giữa). TA có thể gọi ngẫu nhiên hai người trong số đó.
- Các ảnh chụp màn hình đa nền tảng, phải thể hiện mã số sinh viên và họ tên đầy đủ của bạn trong phần form.

## 12. Nhật ký Git (Git Commit Log)

Tạo một Git commit mới cho mỗi bước của quy trình kiểm thử (ví dụ: thiết kế checklist, thực thi checklist, ghi nhận bug, từng phiên usability và phần phân tích).

Cung cấp nhật ký Git commit dưới dạng một file định dạng văn bản.

## 13. Vấn đáp (Oral Defense)

Một nhóm **30% sinh viên được chọn ngẫu nhiên** có thể được mời tham gia buổi vấn đáp 5–7 phút trong tuần sau hạn nộp, để giải thích cách bạn đã hoàn thành bài tập này.

## 14. Quy định nộp bài

**Định dạng tên file:** `<StudentID>_HW03_AI_GUIUsability_<SelfAssessedGrade>.zip`

`SelfAssessedGrade`: một số gồm 3 chữ số trong khoảng [000, 100].

Ví dụ: `25127001_HW03_AI_GUIUsability_090.zip`

**Nội dung bắt buộc của file .zip:**

- Báo cáo chính (Markdown + PDF), bao gồm báo cáo checklist GUI và báo cáo đánh giá usability.
- Báo cáo bug, kèm ảnh chụp các bug trên trang GitHub Issues.
- AI Critique và AI Audit Report (Markdown + PDF).
- Nhật ký Git commit (file văn bản).
- File Excel checklist (hơn 40 mục) và bản tóm tắt kiểm thử.
- Bằng chứng các phiên usability (kịch bản nhiệm vụ, ghi chú quan sát, phiếu trả lời SUS / UEQ-S, các phát hiện xếp theo mức độ nghiêm trọng, và video ghi màn hình nếu có) cùng với bảng 7 người tham gia.
- Các ảnh chụp màn hình đa trình duyệt / đa nền tảng.
- File `README.md` chứa bảng tự đánh giá (bên dưới) và báo cáo tóm tắt kiểm thử: số màn hình / luồng đã kiểm thử; số mục checklist đã thiết kế, đã thực thi, passed và failed; số bug; số người tham gia; và các video demo.
- Mọi tài liệu hỗ trợ khác.

Nộp lên Moodle. Về hạn nộp, hãy xem link nộp bài.

## 15. Mẫu đánh giá

| STT | Tiêu chí | Điểm | Điểm tự chấm |
|---|---|---|---|
| 1 | Task 1 – Checklist GUI (thiết kế + thực thi + báo cáo bug) | 30 | |
| 2 | Task 2 – Đánh giá Usability (kịch bản nhiệm vụ + 7 phiên + phân tích) | 40 | |
| 3 | Task 3 – Đa trình duyệt / Đa nền tảng (≥ 3 nền tảng) | 20 | |
| 4 | Agent Skills | 10 | |
| | **Tổng** | **100** | |

## 16. Tài liệu tham khảo

- ISTQB Foundation Level Syllabus (phiên bản mới nhất).
- Hardman, P. (2025). *A Post-AI Learning Taxonomy.*
- Fuster Rabella, M. (2025). *OECD Education Working Paper No. 338.*
- Anthropic (2025). *Building Reliable AI Test Agents* — blog kỹ thuật.
- Tài liệu của DeepEval & Promptfoo — các framework kiểm thử LLM.

## 17. Các quy định khác

- **Không được phép nộp trễ.**
- Thiếu bất kỳ tài liệu bắt buộc nào sẽ bị **0 điểm**.
- Sao chép giữa các sinh viên, bao gồm cả prompt, sẽ bị **0 điểm cho cả hai bên**.
