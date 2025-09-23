
## Services

외부 서버의 API 를 호출하기 위한 코드가 작성되어 있습니다.
해당 성격의 코드들만 모아둠으로써 관리 편의성을 증가시킵니다.

services 하위에 있는 파일들을 하나로 뭉쳐서 작성할 수도 있지만,
영역 별로 코드를 분리하여 작성할 경우에는 유지보수가 쉬워지는 효과가 있습니다.

**영역 별로 코드를 분리한 예시:**

- ArticleService
- ProductService

**유지보수가 어떻게 쉬워지나요?**

- ArticleService 에는 오로지 Article 에 관련된 코드만이 들어갑니다. Product 를 신경쓰지 않아도 됩니다.
- 추후에 Article API 가 수정된 경우, ArticleService 만 수정하면 됩니다.
