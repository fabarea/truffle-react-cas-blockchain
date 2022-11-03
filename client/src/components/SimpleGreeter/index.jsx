import { useState, useEffect } from 'react';

export default function SimpleGreeter() {

    //const [formData, setFormData] = useReducer(formReducer, {});
    const [submitting, setSubmitting] = useState(false);
    const [currentFriend, setCurrentFriend] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        // await newGreeting(name)
        // await greet()

        setTimeout(() => {
            localStorage.setItem('currentFriend', name)
            setCurrentFriend(name)
            setSubmitting(false);
        }, 500)
    }

    useEffect(() => {
        const _currentFriend = localStorage.getItem('currentFriend') ?? ''
        setCurrentFriend(_currentFriend)
    }, [])


    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    return (
        <div className="container">
            <h1>Hello my friend</h1>

            {submitting &&
                <div>Submtting Form...</div>
            }
            <div>
                {currentFriend
                    ? <>My current friend is <strong>{currentFriend}</strong></>
                    : <>I don't have any friend yet...</>
                }
            </div>

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label>
                        <p>Enter your next friend</p>
                        <input name="name" onChange={handleNameChange} />
                    </label>
                </fieldset>
                <div className="mt-3">
                    {name && <>Do you want to say hello to <strong>{name}</strong> ?</>}
                    <div>
                        <button type="submit" className="btn btn-primary me-3">Say hello!</button>
                        {/* <button type="button" className="btn btn-secondary" onClick={greet}>Read</button> */}
                    </div>
                </div>
            </form>
        </div>
    )
}