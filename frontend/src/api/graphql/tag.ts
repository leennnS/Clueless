export const TAGS_QUERY = `
  query Tags {
    tags {
      tag_id
      name
    }
  }
`;

export const TAG_QUERY = `
  query Tag($id: Int!) {
    tag(id: $id) {
      tag_id
      name
    }
  }
`;

export const CREATE_TAG_MUTATION = `
  mutation CreateTag($input: CreateTagInput!) {
    createTag(createTagInput: $input) {
      tag_id
      name
    }
  }
`;

export const UPDATE_TAG_MUTATION = `
  mutation UpdateTag($input: UpdateTagInput!) {
    updateTag(updateTagInput: $input) {
      tag_id
      name
    }
  }
`;

export const DELETE_TAG_MUTATION = `
  mutation DeleteTag($id: Int!) {
    deleteTag(id: $id) {
      message
    }
  }
`;
