import UserList from '@/components/users/UserList';


const Users = () => {
  return (
    <div className='p-2 md:p-2 md:pl-12 lg:p-6 lg:pl-12 '>
      <h3 className="text-2xl font-bold mb-4">Users List</h3>
      <UserList />
    </div>
  );
}

export default Users;
