import './register.scss';
import { Logo, LukePorter } from '../../assets';
import { Button, Gap, Input, Link } from '../../components';

const Register = ({...rest}) => {
    return (
            <div className="main-page">
                <div className="left">
                    <img src={LukePorter} className="bg-image" alt="bgImage"/>
                </div>
                <div className="right">
                    <p className='title'>Register</p>
                    <Input label="Full Name" placeholder = "Full Name"/>
                    <Gap height={7} />
                    <Input label="Email" placeholder = "Email"/>
                    <Gap height={7} />
                    <Input label="Password" placeholder = "Password" type="password"/>
                    <Gap height={20}/>
                    <Button title="Register"/>
                    <Link className="link" title="Kembali ke login" />
                </div>
            </div>
    )
}

export default Register