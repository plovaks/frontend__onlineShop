import React,{useState} from "react";
import './DropdownMenu.css'
export default function DropdownMenu({children}){

    const [isOpen, setIsOpen] = useState(false);

    return(
        <div className="dropdown">
            <div onClick={()=>setIsOpen(!isOpen)} className="dropdown__menu">
                Меню
            </div>

            {isOpen &&
                <div className="dropdown_items">
                    {children}
                </div>
            }
        </div>
    )
         
}