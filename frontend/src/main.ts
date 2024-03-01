import "./style.css";
import { safeFetch } from "./lib/http";
import z from "zod"


const UsersScheam = z.object({
  email: z.string(),
  password: z.string()
})

const emailInput = document.getElementById("emailInput") as HTMLInputElement;
const passwordInput = document.getElementById(
  "passwordInput"
) as HTMLInputElement;
const verificationPasswordInput = document.getElementById(
  "passwordVerificationInput"
) as HTMLInputElement;
const registrationDiv = document.getElementById(
  "registrationInputsDiv"
) as HTMLDivElement;
const appDiv = document.getElementById("app") as HTMLDivElement;
const registrationButton = document.getElementById(
  "registrationButton"
) as HTMLButtonElement;

const isValidEmail = (email: string): boolean => {
  const mailIndex = email.indexOf("@");
  const dotIndex = email.indexOf(".");
  if (mailIndex === -1 || dotIndex === -1) return false;
  if (
    !email.includes("@") &&
    !email.includes(".") &&
    email.indexOf("@")! < email.lastIndexOf(".")
    )
    return false;
    
    if (mailIndex === dotIndex - 1) return false;
    
    if (mailIndex === email.length - 1) return false;
    
    if (dotIndex === email.length - 1) return false;
    
    return true;
  };
  
  const isValidPassword = (password: string) => {
    if (password.length < 5) return false;
    
    return true;
};

const isValidVerificationPassword = (password: string) => {
  if (password !== passwordInput.value) return false;
  return true;
};

const checkAllValidationIsDone = () => {
  if (
    isValidVerificationPassword(verificationPasswordInput.value) === true &&
    isValidPassword(passwordInput.value) === true &&
    isValidEmail(emailInput.value) === true
  ) {
    registrationButton.disabled = false;
    return;
  }

  registrationButton.disabled = true;
};

const InputValueToObjectForm = (email: string, password: string) => {
  return { email: email, password: password};
};


const postNewUser = async () => {
  const response = await safeFetch({
    method: "POST",
    url: `http://localhost:3000/api/users/registration`,
    schema: UsersScheam,
    payload: InputValueToObjectForm(emailInput.value, passwordInput.value)
  })
  if(!response.success) {
    if (response.status === 409) {
      alert("Ez az email már létezik")
      return false
    }
    alert("Valami hiba történt, térj vissza később")
    return false
  }

  return true
}



const addEventListenerBackToMainButton = () => {
  (document.getElementById("backToMain") as HTMLButtonElement).addEventListener("click", () => {
    registrationDiv.style.display = "block"
    appDiv.style.display = "none"
    emailInput.value = ""
    passwordInput.value = ""
    verificationPasswordInput.value = ""
    registrationButton.disabled = true
    verificationPasswordInput.style.borderColor = "#ccc";
    passwordInput.style.borderColor = "#ccc";
    emailInput.style.borderColor = "#ccc";
  })
}




emailInput.addEventListener("blur", () => {
  if (isValidEmail(emailInput.value) === false) {
    emailInput.style.borderColor = "red";
    return;
  }
  emailInput.style.borderColor = "green";
  checkAllValidationIsDone();
});

passwordInput.addEventListener("input", () => {
  if (isValidPassword(passwordInput.value) === false) {
    passwordInput.style.borderColor = "red";
    return;
  }
  passwordInput.style.borderColor = "green";
  checkAllValidationIsDone();
});

verificationPasswordInput.addEventListener("input", () => {
  if (isValidVerificationPassword(verificationPasswordInput.value) === false) {
    verificationPasswordInput.style.borderColor = "red";
    return;
  }
  verificationPasswordInput.style.borderColor = "green";
  checkAllValidationIsDone();
});




registrationButton.addEventListener("click", async () => {
  const checkPost = await postNewUser()
  if(checkPost === false) {
    return
  } 
  registrationDiv.style.display = "none"
  appDiv.style.display = "block"
  appDiv.innerHTML = `<h1>Sikeres Regisztráció!</h1>
                      <button id="backToMain">Vissza a főoldalra</button>`
  addEventListenerBackToMainButton()
} )



