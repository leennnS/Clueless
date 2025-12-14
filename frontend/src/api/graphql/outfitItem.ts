export const OUTFIT_ITEMS_QUERY = `
  query OutfitItems {
    outfitItems {
      outfit_item_id
      outfit_id
      item_id
      item {
        item_id
        name
        category
        color
        image_url
        user_id
      }
      x_position
      y_position
      z_index
      transform
    }
  }
`;

export const OUTFIT_ITEM_QUERY = `
  query OutfitItem($id: Int!) {
    outfitItem(id: $id) {
      outfit_item_id
      outfit_id
      item_id
      item {
        item_id
        name
        category
        color
        image_url
        user_id
      }
      x_position
      y_position
      z_index
      transform
    }
  }
`;

export const OUTFIT_ITEMS_BY_OUTFIT_QUERY = `
  query OutfitItemsByOutfit($outfitId: Int!) {
    outfitItemsByOutfit(outfitId: $outfitId) {
      outfit_item_id
      outfit_id
      item_id
      item {
        item_id
        name
        category
        color
        image_url
        user_id
      }
      x_position
      y_position
      z_index
      transform
    }
  }
`;

export const CREATE_OUTFIT_ITEM_MUTATION = `
  mutation CreateOutfitItem($input: CreateOutfitItemInput!) {
    createOutfitItem(createOutfitItemInput: $input) {
      outfit_item_id
      outfit_id
      item_id
      item {
        item_id
        name
        category
        color
        image_url
        user_id
      }
      x_position
      y_position
      z_index
      transform
    }
  }
`;

export const UPDATE_OUTFIT_ITEM_MUTATION = `
  mutation UpdateOutfitItem($input: UpdateOutfitItemInput!) {
    updateOutfitItem(updateOutfitItemInput: $input) {
      outfit_item_id
      outfit_id
      item_id
      item {
        item_id
        name
        category
        color
        image_url
        user_id
      }
      x_position
      y_position
      z_index
      transform
    }
  }
`;

export const DELETE_OUTFIT_ITEM_MUTATION = `
  mutation DeleteOutfitItem($id: Int!) {
    deleteOutfitItem(id: $id) {
      message
    }
  }
`;
