export const CLOTHING_ITEMS_QUERY = `
  query ClothingItems {
    clothingItems {
      item_id
      name
      category
      user_id
      color
      image_url
      uploaded_at
      updated_at
      user {
        user_id
        username
        email
        profile_image_url
      }
      tags {
        tag_id
        name
      }
    }
  }
`;

export const CLOTHING_ITEM_QUERY = `
  query ClothingItem($id: Int!) {
    clothingItem(id: $id) {
      item_id
      name
      category
      user_id
      color
      image_url
      uploaded_at
      updated_at
      user {
        user_id
        username
        email
        profile_image_url
      }
      tags {
        tag_id
        name
      }
    }
  }
`;

export const CLOTHING_ITEMS_BY_USER_QUERY = `
  query ClothingItemsByUser($userId: Int!) {
    clothingItemsByUser(userId: $userId) {
      item_id
      name
      category
      user_id
      color
      image_url
      uploaded_at
      updated_at
      user {
        user_id
        username
        email
        profile_image_url
      }
      tags {
        tag_id
        name
      }
    }
  }
`;

export const CREATE_CLOTHING_ITEM_MUTATION = `
  mutation CreateClothingItem($createClothingItemInput: CreateClothingItemInput!) {
    createClothingItem(createClothingItemInput: $createClothingItemInput) {
      item_id
      name
      category
      user_id
      color
      image_url
      tags {
        tag_id
        name
      }
    }
  }
`;


export const UPDATE_CLOTHING_ITEM_MUTATION = `
  mutation UpdateClothingItem($updateClothingItemInput: UpdateClothingItemInput!) {
    updateClothingItem(updateClothingItemInput: $updateClothingItemInput) {
      item_id
      name
      category
      user_id
      color
      image_url
      tags {
        tag_id
        name
      }
    }
  }
`;


export const DELETE_CLOTHING_ITEM_MUTATION = `
  mutation DeleteClothingItem($id: Int!) {
    deleteClothingItem(id: $id) {
      message
    }
  }
`;
