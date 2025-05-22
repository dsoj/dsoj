"use client";
import { UserRoleText } from '@/constant/User';
import { useEffect, useState } from 'react';
import { Ban, Exclamation, ExclamationOctagon } from 'react-bootstrap-icons';

export default function UserManage() {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        fetch('/admin/api/user/list')
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    setUserList(res.data);
                }
            });
    }, [setUserList]);

    return (
        <div className="container m-2">
            <div className="col-md-12">
                <h2 className="card-title text-uppercase mb-0">Manage Users</h2>
                <div className="table-responsive">
                    <table className="table no-wrap user-table mb-0">
                        <thead>
                            <tr>
                                <th className="border-0 text-uppercase font-medium pl-4" scope="col"                               >
                                    #
                                </th>
                                <th className="border-0 text-uppercase font-medium" scope="col">
                                    Username
                                </th>
                                <th className="border-0 text-uppercase font-medium" scope="col">
                                    Nickname
                                </th>
                                <th className="border-0 text-uppercase font-medium" scope="col">
                                    Email
                                </th>
                                <th className="border-0 text-uppercase font-medium" scope="col">
                                    Create Time
                                </th>
                                <th className="border-0 text-uppercase font-medium" scope="col">
                                    Role
                                </th>
                                <th className="border-0 text-uppercase font-medium" scope="col">
                                    Manage
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((user: any, index: number) => {
                                return (
                                    <tr key={user.id}>
                                        <td className="pl-4">{index + 1}</td>
                                        <td>
                                            <h5 className="font-medium mb-0">{user.username}</h5>
                                            {/* <span className="text-muted">{user}</span> */}
                                        </td>
                                        <td>
                                            <span className="text-muted">{user.nickname}</span>
                                        </td>
                                        <td>
                                            <span className="text-muted">{user.email}</span>
                                        </td>
                                        <td>
                                            <span className="text-muted">{new Date(user.createdAt).toLocaleString()}</span>
                                        </td>
                                        <td>
                                            <span className="text-muted">{UserRoleText[user.role]}</span>
                                        </td>
                                        <td>
                                            {/* Ban Start */}
                                            <button
                                                className="btn btn-outline-info btn-sm btn-circle mx-1"
                                                type="button"
                                                data-bs-toggle="modal"
                                                data-bs-target={`#banConfirmModal${index}`}
                                            >
                                                <Ban />
                                            </button>

                                            {/* Ban Confirm Modal */}
                                            <div className="modal" id={`banConfirmModal${index}`}>
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title">Confirm Ban <strong>{user.username}</strong></h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <p>Are you sure you want to ban this user?</p>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                            <button type="button" className="btn btn-danger"><strong>Ban User {user.username}</strong></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Ban End */}

                                            {/* Strict Start */}
                                            <button
                                                className="btn btn-outline-info btn-sm btn-circle mx-1"
                                                type="button"
                                                data-bs-toggle="modal"
                                                data-bs-target={`#strictConfirmModal${index}`}
                                            >
                                                <ExclamationOctagon />
                                            </button>

                                            {/* Strict Confirm Modal */}
                                            <div className="modal" id={`strictConfirmModal${index}`}>
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title">Confirm Strict {user.username}</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <p>Are you sure you want to strictly moderate this user?</p>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                                                            <button type="button" className="btn btn-warning"><strong>Strictly Moderate User {user.username}</strong></button>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Strict End */}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}