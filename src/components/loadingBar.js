import React from "react";

const loadingBar = (
    <div className='lds-ellipsis' style={{ marginLeft: 15 }}>
        <div className='badge-primary'></div>
        <div className='badge-primary'></div>
        <div className='badge-primary'></div>
        <div className='badge-primary'></div>

        <style>
            {
                ".lds-ellipsis {\r\n  display: inline-block;\r\n  position: relative;\r\n  width: 64px;\r\n  height: 7px;\r\n}\r\n.lds-ellipsis div {\r\n  position: absolute;\r\n  top: 0px;\r\n  width: 5px;\r\n  height: 5px;\r\n  border-radius: 50%;\r\n  animation-timing-function: cubic-bezier(0, 1, 1, 0);\r\n}\r\n.lds-ellipsis div:nth-child(1) {\r\n  left: 6px;\r\n  animation: lds-ellipsis1 0.6s infinite;\r\n}\r\n.lds-ellipsis div:nth-child(2) {\r\n  left: 6px;\r\n  animation: lds-ellipsis2 0.6s infinite;\r\n}\r\n.lds-ellipsis div:nth-child(3) {\r\n  left: 26px;\r\n  animation: lds-ellipsis2 0.6s infinite;\r\n}\r\n.lds-ellipsis div:nth-child(4) {\r\n  left: 45px;\r\n  animation: lds-ellipsis3 0.6s infinite;\r\n}\r\n@keyframes lds-ellipsis1 {\r\n  0% {\r\n    transform: scale(0);\r\n  }\r\n  100% {\r\n    transform: scale(1);\r\n  }\r\n}\r\n@keyframes lds-ellipsis3 {\r\n  0% {\r\n    transform: scale(1);\r\n  }\r\n  100% {\r\n    transform: scale(0);\r\n  }\r\n}\r\n@keyframes lds-ellipsis2 {\r\n  0% {\r\n    transform: translate(0, 0);\r\n  }\r\n  100% {\r\n    transform: translate(19px, 0);\r\n  }\r\n}"
            }
        </style>

        <style>
            {
                ".list-group-item.active .lds-ellipsis div { background-color: white; }"
            }
        </style>
    </div>
);

export default loadingBar;
