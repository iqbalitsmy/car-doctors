import React, { useContext } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProviders';
import Swal from 'sweetalert2';

const CheckOut = () => {
    const { title, _id, price, img } = useLoaderData();
    const { user } = useContext(AuthContext);

    const handleBookService = (event) => {
        event.preventDefault();

        const form = event.target;
        const name = form.name.value;
        const date = form.date.value;
        const email = form.email.value;
        const price = form.price.value;

        const order = {
            customerName: name,
            email,
            img,
            date,
            service: title,
            service_id: _id,
            price
        }
        fetch('http://localhost:5000/bookings',
            {
                method: 'POST',
                headers: {
                    'content-type': "application/json",
                },
                body: JSON.stringify(order)
            }
        )
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if(data.insertedId) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your work has been saved",
                        showConfirmButton: false,
                        timer: 1500
                      });
                }
            })

        console.log(order)

    }

    return (
        <div>
            <h2 className='text-center text-3xl font-bold'>Book Service: {title}</h2>
            <form onSubmit={handleBookService} className="card-body">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input type="text" placeholder="name" defaultValue={user?.displayName} name='name' className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Date</span>
                        </label>
                        <input type="date" name='date' className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email" name='email' defaultValue={user?.email} readOnly placeholder="email" className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Due amount</span>
                        </label>
                        <input type="text" defaultValue={'$' + price} name='price' className="input input-bordered" required />
                    </div>
                </div>
                <div className="form-control mt-6">
                    <input className="btn btn-error btn-block" type="submit" value="Order Confirm" />
                </div>
            </form>
        </div>
    );
};

export default CheckOut;