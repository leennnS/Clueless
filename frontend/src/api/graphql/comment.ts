export const COMMENTS_BY_OUTFIT_QUERY = `
  query CommentsByOutfit($outfitId: Int!) {
    commentsByOutfit(outfitId: $outfitId) {
      comment_id
      content
      user_id
      outfit_id
      created_at
      updated_at
    }
  }
`;

export const COMMENT_QUERY = `
  query Comment($id: Int!) {
    comment(id: $id) {
      comment_id
      content
      user_id
      outfit_id
      created_at
      updated_at
    }
  }
`;

export const CREATE_COMMENT_MUTATION = `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(createCommentInput: $input) {
      comment_id
      content
      user_id
      outfit_id
      created_at
      updated_at
    }
  }
`;

export const UPDATE_COMMENT_MUTATION = `
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(updateCommentInput: $input) {
      comment_id
      content
      user_id
      outfit_id
      created_at
      updated_at
    }
  }
`;

export const DELETE_COMMENT_MUTATION = `
  mutation DeleteComment($id: Int!) {
    deleteComment(id: $id) {
      message
    }
  }
`;
