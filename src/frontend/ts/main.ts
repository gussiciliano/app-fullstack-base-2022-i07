declare const M;

class Main implements EventListenerObject, HandleResponse{
 
    private framework: Framework = new Framework();

    getDevicesFromServer() {
        this.framework.ejecutarRequest("GET", "http://localhost:8000/devices",this);
    }

    cambiarEstadoDispositivoAlServidor() {
        //let json = { id: 1, state: 0 };
        //this.framework.ejecutarRequest("POST", "http://localhost:8000/deviceChange",this,json);
    }

    cargarGrilla(devices: Array<Device>) {
        let cajaDips = document.getElementById("devices");
        let grilla:string = "<div class='row'>";

        for (let device of devices) {
            grilla += `<div class="col s12 m6 l3"  style="
            padding: .75rem .75rem;"><div style="border: #3174df;
                                                              border-width: 3px;
                                                              border-style: solid;">`;
            
            if (device.type == 1) {
                grilla+=`<img src="static/images/lightbulb.png" alt="" class="circle"> `   
            } else {
                grilla+=`<img src="static/images/window.png" alt="" class="circle"> `  
            }
            
            grilla += ` <span class="title negrita">${device.name}</span>
            <p>${device.description}
            </p>
              <div class="switch">
                  <label>`;
            if (device.state) {
                grilla += `<input disabled type="checkbox" checked>`;    
            } else {
                grilla += `<input disabled type="checkbox">`;    
            }
            grilla +=`<span class="lever"></span></label></div>
          </div></div>`;
        }
        grilla += "</div>"
        
        cajaDips.innerHTML = grilla;

        for (let device of devices) {
            let cb = document.getElementById("cb_" + device.id);
            cb.addEventListener("click", this);
        }
    }

    handleEvent(object: Event): void {     
        let tipoEvento: string = object.type;
        let objEvento: HTMLElement;
        objEvento = <HTMLElement>object.target;
        if (objEvento.id == "btnSaludar") {
            
        }
    }
}

window.addEventListener("load", () => {
    let main: Main = new Main();
    main.getDevicesFromServer();
    
    //let btn = document.getElementById("btnSaludar");
    //btn.addEventListener("click", main);
    
});

