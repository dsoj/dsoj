export default function UserManage() {
    return (
        <div className="container m-2">
            <div className="col-md-12">
                <h2 className="card-title text-uppercase mb-0">Manage Users</h2>
                <div className="table-responsive">
                    <table className="table no-wrap user-table mb-0">
                        <thead>
                            <tr>
                                <th
                                    className="border-0 text-uppercase font-medium pl-4"
                                    scope="col"
                                >
                                    #
                                </th>
                                <th className="border-0 text-uppercase font-medium" scope="col">
                                    Username
                                </th>
                                <th className="border-0 text-uppercase font-medium" scope="col">
                                    Email
                                </th>
                                <th className="border-0 text-uppercase font-medium" scope="col">
                                    Nickname
                                </th>
                                <th className="border-0 text-uppercase font-medium" scope="col">
                                    CreateTime
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
                            <tr>
                                <td className="pl-4">1</td>
                                <td>
                                    <h5 className="font-medium mb-0">Daniel Kristeen</h5>
                                    <span className="text-muted">Texas, Unitedd states</span>
                                </td>
                                <td>
                                    <span className="text-muted">Visual Designer</span>
                                    <br />
                                    <span className="text-muted">Past : teacher</span>
                                </td>
                                <td>
                                    <span className="text-muted">daniel@website.com</span>
                                    <br />
                                    <span className="text-muted">999 - 444 - 555</span>
                                </td>
                                <td>
                                    <span className="text-muted">15 Mar 1988</span>
                                    <br />
                                    <span className="text-muted">10: 55 AM</span>
                                </td>
                                <td>
                                    <select
                                        id="exampleFormControlSelect1"
                                        className="form-control category-select"
                                    >
                                        <option>Modulator</option>
                                        <option>Admin</option>
                                        <option>User</option>
                                        <option>Subscriber</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-outline-info btn-circle btn-lg btn-circle"
                                        type="button"
                                    >
                                        <i className="fa fa-key" />
                                    </button>
                                    <button
                                        className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
                                        type="button"
                                    >
                                        <i className="fa fa-trash" />
                                    </button>
                                    <button
                                        className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
                                        type="button"
                                    >
                                        <i className="fa fa-edit" />
                                    </button>
                                    <button
                                        className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
                                        type="button"
                                    >
                                        <i className="fa fa-upload" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}