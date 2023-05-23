import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Select from 'react-select'
import { Row, Col, Button, Form, Tabs, Tab, Table } from "react-bootstrap";
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'


const typesList = [{ id: 1, name: "one more choice" },
{ id: 2, name: "score zero" }
]

const Drawer = (props) => {
    const [name, setName] = useState('');
    const [points, setPoints] = useState('');
    const [type, setType] = useState(null);
    const cookies = new Cookies();

    const handleAddItem = () => {
        if (name === '' || points === '') {
            return;
        }

        const newItem = {
            id: new Date().getTime(),
            name: name,
            points: points,
            type: type?.name,
            flipped: false,
        };

        props.setShuffledArray([...props.shuffledArray, newItem]);
        setName('');
        setPoints('');
        setType(null);
        cookies.set('MY_CARDS', [...props.shuffledArray, newItem], { path: '/' });
    };

    const onDelete = (obj) => {
        let filteredArray = props.shuffledArray?.filter((item) => item.id !== obj.id)
        props.setShuffledArray(filteredArray)
        cookies.set('MY_CARDS', filteredArray, { path: '/' });
    }

    return (
        <div className='cards-popup'>
            <div className='drawer-form'>
                <input type={'text'} placeholder='Wirte a name' value={name} onChange={(e) => setName(e.target.value)} />
                <input type={'number'} placeholder='Points' value={points} onChange={(e) => setPoints(e.target.value)} />
                <Select options={typesList}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.name}
                    onChange={(value) => setType(value)}
                    isClearable
                />
                <button onClick={handleAddItem} >Add </button>
            </div>
            <br></br>
            <div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Points</th>
                            <th>type</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.shuffledArray?.map((obj, ind) => (
                            <tr>
                                <td>{obj.name}</td>
                                <td>{obj.points}</td>
                                <td>{obj.type ?? "--"}</td>
                                <td>
                                    {/* <Button className='m-2'><AiFillEdit /></Button> */}
                                    <Button onClick={() => onDelete(obj)}><AiFillDelete /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default Drawer