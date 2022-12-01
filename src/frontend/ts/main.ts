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
            grilla += `<div class="col s12 m6 l3"><div style="background-color: #3174df;">`;
            
            if (device.type == 1) {
                grilla+=`<img src="static/images/lightbulb.png" alt="" class="circle"> `   
            } else {
                grilla+=`<img src="static/images/window.png" alt="" class="circle"> `  
            }
            
            grilla += ` <span class="title negrita">${device.name}</span>
            <p>${device.description}
            </p>
            <a href="#!" class="secondary-content">
              <div class="switch">
                  <label>
                    Off`;
            if (device.state) {
                grilla += `<input id="cb_${device.id}" miAtt="mi dato 1" type="checkbox" checked>`;    
            } else {
                grilla += `<input id="cb_${device.id}" miAtt="mi dato 2" type="checkbox">`;    
            }
            
            
            grilla +=`<span class="lever"></span>
                    On
                  </label>
                </div>
          </a>
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

