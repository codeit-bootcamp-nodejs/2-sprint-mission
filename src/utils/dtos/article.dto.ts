// 게시글 생성
export interface CreateArticleDto {
  title: string
  content: string
}

// 게시글 수정
export interface UpdateArticleDto {
  title: string
  content: string
}

// 게시글 응답 DTO
export interface ArticleResponseDto {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  userId: number
}