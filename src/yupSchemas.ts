import * as yup from "yup"
import { passwordNotLongEnough } from "./modules/register/errorMessages"

export const registerPasswordValidation=
 yup.string().min(3, passwordNotLongEnough).max(255)
