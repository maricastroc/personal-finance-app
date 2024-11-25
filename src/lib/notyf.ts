import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

export const notyf =
  typeof window !== 'undefined'
    ? new Notyf({
        duration: 5000,
        position: {
          x: 'right',
          y: 'top',
        },
        types: [
          {
            type: 'success',
            background: '#201f24',
            icon: {
              className: 'material-icons',
              tagName: 'i',
              color: '#ffffff',
              text: 'check_circle',
            },
          },
          {
            type: 'error',
            background: '#c94736',
            icon: {
              className: 'material-icons',
              tagName: 'i',
              color: '#ffffff',
              text: 'error',
            },
          },
        ],
      })
    : null
