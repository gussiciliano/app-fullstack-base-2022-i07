declare const M;

class Main implements EventListenerObject, HandleResponse{
 
    private framework: Framework = new Framework();

    getDevicesFromServer() {
        this.framework.ejecutarRequest("GET", "http://localhost:8000/devices",this);
    }

    deleteDeviceFromServer(idDisp: number) {
        this.framework.ejecutarDeleteRequest("DELETE", `http://localhost:8000/devices/${idDisp}`,this);
    }

    addNewDeviceFromServer(name: string, description: string, type: string) {
        let newDevice = { name: name, description: description,  type: type, state: 1};
        this.framework.ejecutarAgregarRequest("POST", `http://localhost:8000/devices`,this, newDevice);
    }

    editDeviceFromServer(idDisp: number, name: string, description: string, type: string, state: number) {
        let editedDevice = { name: name, description: description,  type: type, state: state};
        this.framework.ejecutarAgregarRequest("PUT", `http://localhost:8000/devices/${idDisp}`,this, editedDevice);
    }

    getDeviceFromServer(idDisp: number, petition: string){
        return this.framework.ejecutarTraerRequest("GET", `http://localhost:8000/devices/${idDisp}`,this, petition);
    }

    refreshAndCloseModal(idModal: string){
        this.getDevicesFromServer();
        let modal = document.getElementById(idModal);
        let instanceModal = M.Modal.getInstance(modal);
        instanceModal.close();
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

    cargarDevice(device: Device, petition: string){
        if(petition == "edit"){
            (<HTMLInputElement>document.getElementById("edit-id-disp")).value = device.id.toString();
            (<HTMLInputElement>document.getElementById("edit-name")).value = device.name;
            (<HTMLInputElement>document.getElementById("edit-description")).value = device.description;
            (<HTMLInputElement>document.getElementById("edit-status")).checked = device.state;

            let select = document.getElementById("select-edit-type");
            var instanceSelect = M.FormSelect.getInstance(select);
            (<HTMLInputElement>select).value = device.type.toString();
            instanceSelect.destroy();
            M.FormSelect.init(select, "");
        
        } else if(petition == "delete"){
            document.getElementById("id-borrar").innerHTML = device.id.toString();
            document.getElementById("nombre-borrar").innerHTML = device.name;
            (<HTMLInputElement>document.getElementById("input-id-borrar")).value = device.id.toString();
        }
    }

    handleEvent(object: Event): void {
        let tipoEvento: string = object.type;
        let objEvento: HTMLElement;
        objEvento = <HTMLElement>object.target;
        if (objEvento.id.startsWith("editar_")) {
            let idDisp: number = +objEvento.id.substring(7);
            this.getDeviceFromServer(idDisp, "edit");
            
            let modalEditar = document.getElementById("modal-editar")
            var instanceModalEditar = M.Modal.getInstance(modalEditar);
            instanceModalEditar.open();
        
        } else if (objEvento.id.startsWith("borrar_")) {
            let idDisp: number = +objEvento.id.substring(7);
            this.getDeviceFromServer(idDisp, "delete");
            
            let modalBorrar = document.getElementById("modal-borrar")
            var instanceModalBorrar = M.Modal.getInstance(modalBorrar);
            instanceModalBorrar.open();

        //EDITAR
        } else if (objEvento.id == "cancelar-modal-editar") {
            let modalEditar = document.getElementById("modal-editar");
            let instanceModalEditar= M.Modal.getInstance(modalEditar);
            instanceModalEditar.close();

        } else if (objEvento.id == "confirmar-modal-editar") {
            let idDisp: number = +(<HTMLInputElement>document.getElementById("edit-id-disp")).value;
            let name = (<HTMLInputElement>document.getElementById("edit-name")).value;
            let description = (<HTMLInputElement>document.getElementById("edit-description")).value;
            let type = (<HTMLInputElement>document.getElementById("select-edit-type")).value;
            let state = 0;
            if((<HTMLInputElement>document.getElementById("edit-status")).checked){
                state = 1;
            }
            if(idDisp && name && description && type) {
                this.editDeviceFromServer(idDisp, name, description, type, state);
                this.refreshAndCloseModal("modal-editar")
            } else {
                alert("complete todos los campos");
            }   

        //AGREGAR
        } else if (objEvento.id == "cancelar-modal-agregar") {
            let modalAgregar = document.getElementById("modal-agregar");
            let instanceModalAgregar = M.Modal.getInstance(modalAgregar);
            instanceModalAgregar.close();

        } else if (objEvento.id == "confirmar-modal-agregar") {
            let name = (<HTMLInputElement>document.getElementById("txt-name")).value;
            let description = (<HTMLInputElement>document.getElementById("txt-description")).value;
            let type = (<HTMLInputElement>document.getElementById("select-type")).value;
            if(name && description && type) {
                this.addNewDeviceFromServer(name, description, type);
                this.refreshAndCloseModal("modal-agregar")
            } else {
                alert("complete todos los campos");
            }

        //BORRAR
        } else if (objEvento.id == "cancelar-modal-borrar") {
            let modalBorrar = document.getElementById("modal-borrar");
            let instanceModalBorrar = M.Modal.getInstance(modalBorrar);
            instanceModalBorrar.close();
        
        } else if (objEvento.id == "confirmar-modal-borrar") {
            let idDispToDelete: number = +(<HTMLInputElement>document.getElementById("input-id-borrar")).value;
            this.deleteDeviceFromServer(idDispToDelete);
            this.refreshAndCloseModal("modal-borrar");
        }
    }
}

window.addEventListener("load", () => {
    let main: Main = new Main();
    main.getDevicesFromServer();
    
    var elemsM = document.querySelectorAll('.modal');
    M.Modal.init(elemsM, "");

    var elemsSelect = document.querySelectorAll('select');
    M.FormSelect.init(elemsSelect, "");
    
    document.getElementById("confirmar-modal-borrar").addEventListener("click", main);
    document.getElementById("cancelar-modal-borrar").addEventListener("click", main);

    document.getElementById("confirmar-modal-agregar").addEventListener("click", main);
    document.getElementById("cancelar-modal-agregar").addEventListener("click", main);

    document.getElementById("confirmar-modal-editar").addEventListener("click", main);
    document.getElementById("cancelar-modal-editar").addEventListener("click", main);
});

