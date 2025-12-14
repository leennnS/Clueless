import requests
payload={
    "query": "query OutfitItemsByOutfit($outfitId: Int!) { outfitItemsByOutfit(outfitId: $outfitId) { outfit_item_id outfit_id item_id x_position y_position z_index transform item { item_id name image_url } } }",
    "variables": {"outfitId": 3}
}
res = requests.post('http://localhost:3000/graphql', json=payload)
print(res.status_code)
print(res.text)
