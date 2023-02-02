import React, { useEffect, useState } from "react"
import { Navigate, Outlet, useNavigate, useParams } from "react-router"
import { Link, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux'

// type Props = {
//     children?: React.ReactNode
// };


// const CreateBlog:React.FC<Props> = (props) => {
const CreateBlog = () => {

    // const {children} = props;

    const navigate = useNavigate();
    const handleClick = () =>{
        // navigate("child");
        navigate({
            pathname:'child',
            search: '?id=asc'
        })
        
    }

    const { id } = useParams();
    const arr_temp = [
        {id:1, nama:'AAA'},
        {id:2, nama:'BBB'},
        {id:3, nama:'CCC'}
    ];

    // testing fetch api

    const [posts, setPosts] = useState([]);
    useEffect(()=>{
        fetch("https://jsonplaceholder.typicode.com/posts?_limit=5",{
            method:'GET',
        })
            .then(response=>{
                return response.json()
            })
            .then((data)=>{

                setPosts(data);
                // alert(JSON.stringify(arr_temp_api))
                console.log(data)
            })
            .catch((err)=>{
                alert(err.message)
            })
    },[])
    // <...end>

    return (
        
        <div>

            Content Create Blog {id}

            <div>
                <button onClick={handleClick}> To Child </button>
                <p>
                    <Link to = "child"> Link Child </Link><br />
                    <Link to = ".."> Back </Link>
                </p>
            </div>

            <div>  
                <div> {"======"}</div>
                {arr_temp.map(data=>{
                    return (
                        <div key={data.id}> {data.id}. {data.nama} </div>
                    )
                })}

                <div> {"======"}</div>
            </div>

            <h2><u>fetch API </u></h2>
            <ul>
                {
                    posts.map((post)=>{
                        return (
                            <li key={post['id']}> {post?.['title']} </li>
                        )
                    })
                }
            </ul>

            <Outlet />
        </div>
        
    )
}

// const mapStateToProps = (state:any) => {
//     return {
//         order: state.totalOrder
//     }
// }

export default CreateBlog;
// export default connect(mapStateToProps)(CreateBlog);