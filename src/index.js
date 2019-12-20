import {Request} from "./request";
import {UI} from "./ui";

const form = document.getElementById("employee-form");
const nameInput = document.getElementById("name");
const departmentInput = document.getElementById("department");
const salaryInput = document.getElementById("salary");
const employeeList = document.getElementById("employees");
const updateEmployeeButton = document.getElementById("update");

const request = new Request("http://localhost:3000/employees");
const ui = new UI();

let updateState = null;

eventListener();

function eventListener(){
    document.addEventListener("DOMContentLoaded",getAllEmployees);
    form.addEventListener("submit",addEmploye);
    employeeList.addEventListener("click", updateOrDelete);
    updateEmployeeButton.addEventListener("click", updateEmploye);
}

function getAllEmployees(){
   request.get()
   .then(employees => ui.addAllEmployeeToUI(employees))
   .catch(err => console.log(err));
}
function addEmploye(e){
    const empName = nameInput.value.trim();
    const empDepartment = departmentInput.value.trim();
    const empSalary = salaryInput.value.trim();
    if(empName == "" || empDepartment == "" || empSalary == "" ){
        alert("Lütfen tüm alanları doldurunuz!");
    }
    else{
        request.post({name: empName, department:empDepartment, salary:Number(empSalary)})
        .then(employee => {
            ui.addEmployeToUI(employee)
        })
        .catch(err => console.log(err));
    }
    ui.clearInputs();
    e.preventDefault();
}
function updateOrDelete(e){
    if(e.target.id === "delete-employee"){
        //silme
        deleteEmploye(e.target);
    }
    else if (e.target.id === "update-employee"){
        //update
        updateEmployeController(e.target.parentElement.parentElement);

    }
}
function deleteEmploye(targetEmploye){
    const id = targetEmploye.parentElement.previousElementSibling.previousElementSibling.textContent;
    request.delete(id)
    .then(message => {
        ui.deleteEmployeFromUI(targetEmploye.parentElement.parentElement);
    }) 
    .catch(err => console.log(err));
}
function updateEmployeController(targetEmploye){
    ui.toggleUpdateButton(targetEmploye);
    if(updateState == null){
        updateState  = {
            updateId : targetEmploye.children[3].textContent,
            updateParent : targetEmploye  
        };
    }else{ updateState = null; }
}
function updateEmploye(){
    if(updateState){
        const data = {name: nameInput.value.trim(),department:departmentInput.value.trim(),salary:Number(salaryInput.value.trim())};
        request.put(updateState.updateId,data)
        .then(updatedEmploye => ui.updateEmployeOnUI(updatedEmploye,updateState.updateParent))
        .catch(err => console.log(err));

    }
}







// request.delete(4)
// .then(message => console.log(message))
// .catch(err => console.log(err));