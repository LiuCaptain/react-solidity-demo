import Toastify from "toastify-js"
import "toastify-js/src/toastify.css"

const toast = {
  success(message: string, duration = 3000) {
    Toastify({
      text: message,
      duration: duration,
      gravity: "top",
      position: "center",
      style: {
        background: "rgba(103, 194, 58, 1)",
        color: "rgba(255, 255, 255, 1)"
      }
    }).showToast()
  },
  error(message: string, duration = 3000) {
    Toastify({
      text: message,
      duration: duration,
      gravity: "top",
      position: "center",
      style: {
        background: "rgba(245, 108, 108, 1)",
        color: "rgba(255, 255, 255, 1)"
      }
    }).showToast()
  },
  info(message: string, duration = 3000) {
    Toastify({
      text: message,
      duration: duration,
      gravity: "top",
      position: "center",
      style: {
        background: "rgba(64, 158, 255, 1)",
        color: "rgba(255, 255, 255, 1)"
      }
    }).showToast()
  }
}

export default toast
