import {useState} from "react";
import {NavLink} from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import {useUser} from "../context/userContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal)

export default function Main({children}) {
  // state
  const [options, setOptions] = useState(false);
  // context
  const {user, logout} = useUser();

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="flex flex-col bg-gray-900 h-screen text-gray-300 w-16 z-20">
        <div className="flex p-2 justify-center items-center h-16 bg-gray-900">
          {/*<img src={logo} className="rounded-full w-10 h-10" alt="zentaglogo" />*/}
        </div>
        <div className="flex-1">
          <Tippy content="Home" arrow={true} placement="right">
            <NavLink
              activeClassName="text-blue-600 bg-gray-800"
              className="flex tooltip justify-center items-center hover:bg-gray-800 hover:text-orange-800 py-3"
              to="/home"
            >
              <div className="font-semibold">
                <i className="las la-lg la-chart-pie"/>
              </div>
            </NavLink>
          </Tippy>
        </div>
        <Tippy content="Ajustes" arrow={true} placement="right">
          <NavLink
            activeClassName="text-blue-600 bg-gray-800"
            className="flex tooltip justify-center items-center hover:bg-gray-800 hover:text-orange-800 py-3"
            to="/settings"
          >
            <div className="font-semibold">
              <i className="las la-lg la-cog"/>
            </div>
          </NavLink>
        </Tippy>
        <div className="flex-initial flex justify-center items-center mb-1">
          {user && (
            <div className="w-full text-center text-white py-3 px-2" onClick={() => setOptions(!options)}>
              <div className="font-semibold">
                <span className="flex h-2 w-2">
                  <button
                    className="absolute left-10 inline-flex justify-center items-center p-2 h-4 w-4 rounded-full hover:bg-orange-800 bg-gray-400 text-xs font-light"
                    onClick={() => {
                      MySwal.fire({
                        title: '¿Esta seguro de cerrar la sesión?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, cerrar sesión',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          logout();
                        }
                      });
                    }}
                  >
                    <i className="las text-black la-arrow-right"/>
                  </button>
                </span>
              </div>
              <span className="p-3 bg-gray-600 rounded-full font-medium text-xs">
                {user.first_name[0]}
                {user.last_name[0]}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {/* Content */}
        {children}
      </div>
    </div>
  );
}