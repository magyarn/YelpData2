import json
from pprint import pprint

data = json.load(open('AArestaurants.json'))


count = 0
records = {}
cuisines = []
# flare = {"name":"Ann Arbor Restaurants",
#         "children": [],
#         }
        
flare2 = {"name":"Ann Arbor Restaurants",
        "children": [],
        }


# for d in data["businesses"]:
#     for cat in d["categories"]:
#         cuisine = cat["title"]
#         if cuisine not in cuisines:
#             cuisines.append(cuisine)
#             records[cuisine] = count
#             flare["children"].append({"name": cuisine,
#                                     "children": [{
#                                             "name": d["name"],
#                                             "size": 1
#                                         }]
#                                     })
#         else:
#             flare["children"][cuisines.index(cuisine)]["children"].append({"name":d["name"], "size":1})

for d in data["businesses"]:
    rating = d["rating"]
    review_count = d["review_count"]
    try:
        if d["price"]:
            price = d["price"]
            for cat in d["categories"]:
                cuisine = cat["title"]
                if cuisine not in cuisines:
                    cuisines.append(cuisine)
                    records[cuisine] = [price]
                    flare2["children"].append({"name": cuisine,
                                               "children":[{"name":price,
                                                            "children":[{"name":"Name: " + d["name"] + "\nPrice Range: " + price + "\nRating: " + str(rating) + "\nReviews: " + str(review_count),
                                                                        "size":1
                                                                        }]
                                                          }]
                                             })
                else:
                    if price not in records[cuisine]:
                        records[cuisine].append(price)
                        flare2["children"][cuisines.index(cuisine)]["children"].append({"name": price,
                                                                                       "children": [{"name":"Name: " + d["name"] + "\nPrice Range: " + price + "\nRating: " + str(rating) + "\nReviews: " + str(review_count),
                                                                                                    "size": 1
                                                                                                    }]
                                                                                         })
                    else:
                        flare2["children"][cuisines.index(cuisine)]["children"][records[cuisine].index(price)]["children"].append({
                                                                                                                        "name":"Name: " + d["name"] + "\nPrice Range: " + price + "\nRating: " + str(rating) + "\nReviews: " + str(review_count),
                                                                                                                        "size":1
                                                                                                                      })
    except KeyError:
        pass
    
  
        
            
with open('AAflare.json', 'w') as outfile:
    json.dump(flare2, outfile)