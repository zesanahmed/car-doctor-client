import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import CheckInRow from "./CheckInRow";


const Checkings = () => {
    const { user } = useContext(AuthContext);
    const [checkings, setCheckings] = useState([]);

    const url = `http://localhost:5000/checkings?email=${user?.email}`;
    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => setCheckings(data))
    }, [url]);

    const handleDelete = (id) => {
        const proceed = confirm('Are you sure you want to delete');
        if (proceed) {
            fetch(`http://localhost:5000/checkings/${id}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.deletedCount > 0) {
                        alert('Deleted successfully')
                        const remaining = checkings.filter(checking => checking._id !== id)
                        setCheckings(remaining)
                    }
                })
        }
    };

    const handleCheckInConfirm = id => {
        fetch(`http://localhost:5000/checkings/${id}`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ status: 'confirm' })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.modifiedCount > 0) {
                    // update state
                    const remaining = checkings.filter(checkIn => checkIn._id !== id);
                    const updated = checkings.find(checkIn => checkIn._id === id);
                    updated.status = 'confirm'
                    const newCheckings = [updated, ...remaining];
                    setCheckings(newCheckings)
                }
            })
    };

    return (
        <div>
            <h2 className="text-5xl">Your CheckIns : {checkings.length}</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>

                            </th>
                            <th>Image</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            checkings.map(checkIn => <CheckInRow
                                key={checkIn._id}
                                checkIn={checkIn}
                                handleDelete={handleDelete}
                                handleCheckInConfirm={handleCheckInConfirm}
                            ></CheckInRow>)
                        }
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default Checkings;