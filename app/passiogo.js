class tracking{
	constructor(){
		this.busMap = {};
		const tmp = async () => {
			let data = await this.request("https://passiogo.com/mapGetData.php?getBuses=1");
			for(const i in data.buses){
				this.busMap[data.buses[i][0].busName] = data.buses[i][0].busId;
			}
		}
		tmp();
	}

	async request(url){
		let response = await fetch(url, {
			credentials: "omit",
			headers: {
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				"Sec-Fetch-Dest": "empty",
				"Sec-Fetch-Mode": "cors",
				"Sec-Fetch-Site": "same-site"
			},
			referrer: "https://rutgers.passiogo.com/",
			body: "json=%7B%22s0%22%3A%221268%22%2C%22sA%22%3A1%7D",
			method: "POST",
			mode: "cors"
		});
		try{
			let JSON = await response.json();
			return JSON;
		}
		catch(error){
			console.log(error);
		}
	}

	async getBus(busName){
		let data = await this.request("https://passiogo.com/mapGetData.php?bus=1&busId="+this.busMap[busName]);
		return [data.theBus.latitude, data.theBus.longitude, data.theBus.routeId];
	}

	async getStop(stopId, routeId, position){
		let data = await this.request("https://passiogo.com/mapGetData.php?eta=3&stopIds="+stopId+"&routeId="+routeId+"&position="+position+"&userId=1268");
		return data.ETAs;
	}
}

export default tracking;
