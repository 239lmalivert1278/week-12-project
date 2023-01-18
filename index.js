
class house {
    constructor(name) {
        this.name = name;
        this.rooms = [];
    }

    addRoom(name, area) {
        this.rooms.push(new room(name, area));
    }
}

 class room {
    constructor(name, area) {
       this.name = name;
       this.area = area; 
    }
 }

 class HouseService {
    static url = "https://ancient-taiga-31359.herokuapp.com/api/houses";

    static getALLHouses() {
        return $.get(this.url);
    }

    static gethouse(id) {
        return $.get(this.url + `/${id}`);
    }

    static createHouse(house) {
        return $.post(this.url, house);
    }

    static updateHouse(house) {
        return $.ajaxx ({
   url: this.url + `/${house._id}`, 
   dataType: 'json', 
   data: JSON.stringify(house), 
   contentType: 'appliction/json',
   type: 'PUT'
        });
    }

    static deleteHouse(id) {
        return $.ajax ({
          url:  this.url + `/${id}`,
          type: 'DELETE'
        });
    }
 }


 class DOMManger {

    static houses;

    static getALLHOUSES() {
       HouseService.getALLHouses().then(houses => this.render(houses));
    }

    static createHouse(name) {
        HouseService.createHouse(new House(name)
        .then(() => {
            return HouseService.getALLHouses();
        })
        .then((houses) => this.render(houses)));
    }
    static deleteHouse(id) {
      HouseService.deleteHouse(id)
      .then(() => {
        return HouseService.getALLHouses();
      })
      .then((houses) => this.render(houses));
    }

     static addRoom(id) {
    for(let house of this.houses) {
     if (house._id == id) {
        house.rooms.push(new Room($(`#${house._id}-room-name`).value(), $(`#${house._id}-room-area`).value()));
        HouseService.updateHouse(house) 
        .then(() => {
         return HouseService.getALLHouses();   
        })
        .then((houses) => this.render(houses));
     }
      }
     }
   static deleteRoom(houseId, roomId) {
    for  ( let house of this.houses) {
        if (house._id == houseId) {
        for (let room of house.rooms) {
        if (room._id == roomId)    {
         house.rooms.splice(house.rooms.indexOf(room), 1); 
         HouseService.updateHouse(house)
         .then(() => {
            return HouseService.getALLHouses()
         })
         .then((houses) => this.render(houses));
        }
        }    
        }
    }
   }
    static render(houses){
 this.houses = houses;
 $(`#app`).empty();
 for (let house of houses) {
    $(`#app`).prepend(
  `<div id="${house._id}" class="card">
 <div class="card-header">
 <h2>${house.name}</h2>
<button class="btn btn-danger" onclick="DOMManager.deleteHouse('${house._id}')">Delete</button>
</div>
<div class="card-body">
<div class="card">
<div class="row">
<div class="col-sm">
input type="text" id=${house._id}-room-name" class ="form-control" placeholder="Room Name">
</div>
<div class=col-sm">
input type="text" id=${house._id}-room-area" class ="form-control" placeholder="Room area">
</div>
</div>
<button id="${house._id}-new-room" onclick="DOMManger('${house._id}')" class="btn btn-primary form-control">Add</button>
</div>
</div><br> `
    );

    for (let room of house.rooms) {
        $(`#${house._id}`).find('.card-body').append(
            `<p>
            <span id="name-${room._id}"><strong>Name: </strong> ${room.name}</span>
            <span id="area-${room._id}><strong>Area: </strong> ${room.area}</span>
            <button class="btn btn-danger" onclick="DOMManager.deleteRoom('${house._id}', '${room._id})' `

        );
       }
      }
     }
    }

$('#create-new-house').click(() => {
DOMManger.createHouse($('#new-house-name').val());
$('#new-house-name').val('');
});


DOMManger.getALLHOUSES();