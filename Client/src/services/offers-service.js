import { HTTP } from "./httpCommon-service";

class OffersService {
  getRestaurantOffers() {
    return HTTP.get("/offers/restaurant");
  }
  createRestaurantOffers(formData){
    return HTTP.post("/offers",
      formData
    )
  }
  getRestaurantOffersById(restaurantId){
    console.log("restaurantId : ", restaurantId)
    return HTTP.get(`/offers/restaurant/${restaurantId}`);
  }
  updateRestaurantOffer(id,data){
    console.log("here")
    return HTTP.put(`/offers/${id}`,data)

  }
  deleteOffer(id){
    console.log("hereeee")
    return HTTP.delete(`/offers/${id}`);

  }
}

export default new OffersService();
