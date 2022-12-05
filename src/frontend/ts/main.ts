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
        //Div inicial
        let grilla:string = "<div class='row'>";
        for (let device of devices) {
            grilla +=   `<div class="col s12 m6 l3 custom-padding">
                            <div class="device-container">
                                <div class="card margin-zero">
                                    <div class="card-content">`;            
            if (device.type == 1) {
                grilla+=`<img src="static/images/lightbulb.png" alt="" class="circle"> `   
            } else {
                grilla+=`<img src="static/images/window.png" alt="" class="circle"> `  
            }
            grilla += ` <span class="span-vertical title negrita">${device.name}</span>
                        <p>${device.description}</p>
                        <div class="switch">
                            <label>`;
            if (device.state) {
                grilla += `<input disabled type="checkbox" checked>`;    
            } else {
                grilla += `<input disabled type="checkbox">`;    
            }
            grilla +=`<span class="lever"></span>
                     </label>
                     </div>
                </div>
                <div class="card-action">
                    <button class="btn-padding btn waves-effect waves-light button-view" id="editar_${device.id}">Editar</button>
                    <button class="btn-padding btn waves-effect waves-light button-view" id="borrar_${device.id}">Borrar</button>
                </div>
            </div></div></div>`;
        }
        //Div final
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

    openModal(id: string) {
        let modal = document.getElementById(id)
        var instanceModal = M.Modal.getInstance(modal);
        instanceModal.open();
    }

    closeModal(id: string) {
        let modal = document.getElementById(id)
        var instanceModal = M.Modal.getInstance(modal);
        instanceModal.close();
    }

    handleEvent(object: Event): void {
        let objEvento: HTMLElement;
        objEvento = <HTMLElement>object.target;
        if (objEvento.id.startsWith("editar_")) {
            let idDisp: number = +objEvento.id.substring(7);
            this.getDeviceFromServer(idDisp, "edit");
            this.openModal("modal-editar");    
        
        } else if (objEvento.id.startsWith("borrar_")) {
            let idDisp: number = +objEvento.id.substring(7);
            this.getDeviceFromServer(idDisp, "delete");
            this.openModal("modal-borrar");

        //EDITAR
        } else if (objEvento.id == "cancelar-modal-editar") {
            this.closeModal("modal-editar");

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
            this.closeModal("modal-agregar");

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
            this.closeModal("modal-borrar");
        
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

