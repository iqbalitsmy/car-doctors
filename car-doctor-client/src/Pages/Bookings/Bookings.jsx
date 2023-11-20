import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProviders';
import BookingRow from './BookingRow';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
    const { user, logOut } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    const url = `http://localhost:5000/bookings?email=${user?.email}`;

    useEffect(() => {
        fetch(url, {
            method: "GET",
            headers: {
                authorization: `Bearer ${localStorage.getItem('car-access-token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setBookings(data);
                } else {
                    logOut()
                        .then(res => {
                            console.log(res)
                            localStorage.removeItem('car-access-token');
                        })
                        .catch(err => console.log(err))
                    navigate('/');
                }
            });
    }, [url, navigate, logOut]);

    const handleDelete = id => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/bookings/${id}`, {
                    method: 'DELETE'
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount > 0) {
                            const remaining = bookings.filter(booking => booking._id !== id);
                            setBookings(remaining);

                            Swal.fire({
                                title: "Deleted!",
                                text: "Your service has been deleted.",
                                icon: "success"
                            });
                        }
                    })
            }
        });
    }

    const handleBookingConfirm = (id) => {
        console.log("ID", id)
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/bookings/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({ status: 'confirm' })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.modifiedCount > 0) {
                            const remaining = bookings.filter(booking => booking._id !== id);
                            const update = bookings.find(booking => booking._id === id);
                            update.status = 'confirm';
                            const newBookings = [update, ...remaining];
                            setBookings(newBookings);

                            Swal.fire({
                                title: "Confirmed",
                                text: "Your service has been confirmed.",
                                icon: "success"
                            });
                        }
                    })
            }
        });
    }

    return (
        <div>
            <h2>Spiner: {bookings.length}</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>
                                <label>

                                </label>
                            </th>
                            <th>Image</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bookings.map(booking => <BookingRow
                                key={booking._id}
                                booking={booking}
                                handleDelete={handleDelete}
                                handleBookingConfirm={handleBookingConfirm}
                            ></BookingRow>)
                        }
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default Bookings;