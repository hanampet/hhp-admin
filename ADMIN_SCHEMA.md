# Cloud Firestore 관리자 스키마 명세서 (Admin & Admin Logs Schema)

본 문서는 **하남이네 링펫 관리자 (`hhp_admin`)** 시스템에서 사용되는 `admin` (관리자 계정) 및 `admin_logs` (감사 로그) 컬렉션의 데이터베이스 스키마 명세서입니다.

---

## 1. `admin` 컬렉션 (관리자 계정 정보)

관리자 사이트에 접속할 수 있는 계정 정보를 저장하는 컬렉션입니다.

* **컬렉션 경로**: `admin`
* **문서 ID (Document ID)**: 관리자 계정 ID (예: `admin`, `sub_admin1`) 또는 Firestore Auto-ID

### 📄 필드 명세 (Field Specifications)

| 필드명 (Field) | 데이터 타입 (Type) | 필수 여부 | 설명 (Description) | 예시 값 (Example) |
| :--- | :--- | :---: | :--- | :--- |
| **`id`** | String | 필수 | 관리자 로그인 아이디 | `"admin"` |
| **`pw`** | String | 필수 | 관리자 로그인 비밀번호 | `"admin"` |
| **`level`** | String | 필수 | 권한 수준 (`"super"`: 슈퍼 관리자 / `"admin"`: 일반 관리자) | `"super"` |
| **`name`** | String | 필수 | 관리자 성명 / 이름 | `"슈퍼 관리자"` |
| **`email`** | String | 옵션 | 내부 참조 및 이메일 연동용 주소 | `"admin@healingpet.com"` |
| **`role`** | String | 옵션 | 레거시 호환용 권한 필드 (`"super"` 또는 `"admin"`) | `"super"` |
| **`created_at`** | Timestamp | 필수 | 계정 등록 일시 (`FieldValue.serverTimestamp()`) | `2026-09-17 23:50:00` |
| **`updated_at`** | Timestamp | 필수 | 계정 정보 최근 수정 일시 | `2026-09-18 10:30:00` |

### 💡 JSON 구조 예시
```json
{
  "id": "admin",
  "pw": "admin",
  "level": "super",
  "role": "super",
  "name": "슈퍼 관리자",
  "email": "admin@healingpet.com",
  "created_at": "2026-09-17T23:50:00Z",
  "updated_at": "2026-09-18T10:30:00Z"
}
```

---

## 2. `admin_logs` 컬렉션 (작업 감사 로그)

관리자의 접속(로그인/로그아웃) 및 시스템 데이터 조작(추가, 수정, 삭제) 이력을 자동으로 기록하는 컬렉션입니다.

* **컬렉션 경로**: `admin_logs`
* **문서 ID (Document ID)**: Firestore Auto-Generated ID

### 📄 필드 명세 (Field Specifications)

| 필드명 (Field) | 데이터 타입 (Type) | 필수 여부 | 설명 (Description) | 예시 값 (Example) |
| :--- | :--- | :---: | :--- | :--- |
| **`admin_id`** | String | 필수 | 해당 작업을 수행한 관리자의 아이디 | `"admin"` |
| **`admin_name`** | String | 필수 | 해당 작업을 수행한 관리자의 이름 | `"슈퍼 관리자"` |
| **`admin_level`** | String | 필수 | 작업 수행 시점의 관리자 권한 (`"super"` 또는 `"admin"`) | `"super"` |
| **`action`** | String | 필수 | 수행된 작업의 분류 코드 (아래 `action` 유형 표 참조) | `"notice_create"` |
| **`detail`** | String | 필수 | 작업에 대한 상세 설명 | `"공지사항 등록 (제목: 서비스 점검 안내)"` |
| **`created_at`** | Timestamp | 필수 | 작업 발생 및 로그 생성 일시 (`FieldValue.serverTimestamp()`) | `2026-09-18 11:20:15` |

---

### 🏷️ `action` 코드 및 상세 설명 예시

| `action` 코드 | 작업 내용 설명 | `detail` 기록 예시 |
| :--- | :--- | :--- |
| **`login`** | 관리자 로그인 | `"관리자 로그인 성공"` |
| **`logout`** | 관리자 로그아웃 | `"관리자 로그아웃"` |
| **`notice_create`** | 공지사항 새로 등록 | `"공지사항 등록 (제목: 신규 기능 업데이트)"` |
| **`notice_update`** | 기존 공지사항 수정 | `"공지사항 수정 (제목: 점검 시간 변경)"` |
| **`notice_delete`** | 공지사항 삭제 | `"공지사항 삭제"` |
| **`pet_config_update`** | 나의 펫 시스템 밸런스 설정 수정 | `"나의 펫 설정 수정"` |
| **`version_config_update`** | 앱 최신 버전 및 스토어 URL 수정 | `"버전 관리 설정 수정"` |
| **`ai_prompt_update`** | AI 대화 시스템 프롬프트 수정 | `"AI 프롬프트 설정 수정"` |
| **`ai_prompt_reset`** | AI 프롬프트를 기본값으로 초기화 | `"AI 프롬프트 기본값 초기화"` |
| **`ai_model_update`** | 사용할 OpenAI 모델명 설정 수정 | `"AI 모델 설정 수정"` |
| **`meditation_create`** | 마음채우기 힐링 영상 추가 | `"마음채우기 영상 추가 (제목: 불안 해소 명상)"` |
| **`meditation_update`** | 마음채우기 힐링 영상 정보 수정 | `"마음채우기 영상 수정 (제목: 불안 해소 명상)"` |
| **`meditation_delete`** | 마음채우기 힐링 영상 삭제 | `"마음채우기 영상 삭제"` |
| **`admin_create`** | 신규 관리자 계정 생성 | `"신규 관리자 계정 생성 (아이디: manager1, 이름: 이관리)"` |
| **`admin_update`** | 관리자 계정 정보 수정 | `"관리자 계정 수정 (아이디: manager1, 이름: 이수정)"` |
| **`admin_delete`** | 관리자 계정 삭제 | `"관리자 계정 삭제 (이름: 이수정)"` |

### 💡 JSON 구조 예시
```json
{
  "admin_id": "admin",
  "admin_name": "슈퍼 관리자",
  "admin_level": "super",
  "action": "notice_create",
  "detail": "공지사항 등록 (제목: 서비스 점검 안내)",
  "created_at": "2026-09-18T11:20:15Z"
}
```
