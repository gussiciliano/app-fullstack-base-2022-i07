declare const M;

class Main implements EventListenerObject, HandleResponse{
 
    private framework: Framework = new Framework();

    getDevicesFromServer() {
        this.framework.ejecutarRequest("GET", "http://localhost:8000/devices",this);
    }

    deleteDeviceFromServer(idDisp: number) {
        this.framework.ejecutarDeleteRequest("DELETE", `http://localhost:8000/devices/${idDisp}`,this);
    }

    cargarGrilla(devices: Array<Device>) {
        let cajaDips = document.getElementById("devices");
        let grilla:string = "<div class='row'>";

        for (let device of devices) {
            grilla += `<div class="col s12 m6 l3"  style="
            padding: .75rem .75rem;"><div style="border: #3174df;
                                                              border-width: 3px;
                                                              border-style: solid;"><div class="card" style="margin:0;"><div class="card-content">`;
            
            if (device.type == 1) {
                grilla+=`<img src="static/images/lightbulb.png" alt="" class="circle"> `   
            } else {
                grilla+=`<img src="static/images/window.png" alt="" class="circle"> `  
            }
            
            grilla += ` <span style="vertical-align: top;" class="title negrita">${device.name}</span>
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
          </div><div class="card-action">
          <button style="padding: 0 10px;" class="btn waves-effect waves-light button-view" id="editar_${device.id}">Editar</button>
          <button style="padding: 0 10px;" class="btn waves-effect waves-light button-view" id="borrar_${device.id}">Borrar</button>
        </div></div></div>
      </div>`;
        }
        grilla += "</div>"
        
        cajaDips.innerHTML = grilla;

        for (let device of devices) {
            document.getElementById("editar_" + device.id).addEventListener("click", this);
            document.getElementById("borrar_" + device.id).addEventListener("click", this);
        }
    }

    handleEvent(object: Event): void {
        let tipoEvento: string = object.type;
        let objEvento: HTMLElement;
        objEvento = <HTMLElement>object.target;
        if (objEvento.id.startsWith("editar_")) {
            let idDisp = objEvento.id.substring(7);
            alert(idDisp);
        
        } else if (objEvento.id.startsWith("borrar_")) {
            let idDisp = objEvento.id.substring(7);
            document.getElementById("id-borrar").innerHTML = idDisp;
            document.getElementById("nombre-borrar").innerHTML = "ss";
            (<HTMLInputElement>document.getElementById("input-id-borrar")).value = idDisp;
            let modalBorrar = document.getElementById("modal-borrar")
            var instanceModalBorrar = M.Modal.getInstance(modalBorrar);
            instanceModalBorrar.open();

        } else if (objEvento.id == "cancelar-modal-borrar") {
            let modalBorrar = document.getElementById("modal-borrar");
            var instanceModalBorrar = M.Modal.getInstance(modalBorrar);
            instanceModalBorrar.close();
        
        } else if (objEvento.id == "confirmar-modal-borrar") {
            var idDispToDelete: number = +(<HTMLInputElement>document.getElementById("input-id-borrar")).value;
            this.deleteDeviceFromServer(idDispToDelete);

            this.getDevicesFromServer();
            
            let modalBorrar = document.getElementById("modal-borrar");
            var instanceModalBorrar = M.Modal.getInstance(modalBorrar);
            instanceModalBorrar.close();
        }
    }
}

window.addEventListener("load", () => {
    let main: Main = new Main();
    main.getDevicesFromServer();
    
    var elemsM = document.querySelectorAll('.modal');
    M.Modal.init(elemsM, "");
    
    document.getElementById("confirmar-modal-borrar").addEventListener("click", main);
    document.getElementById("cancelar-modal-borrar").addEventListener("click", main);
});

