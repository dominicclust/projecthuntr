import React, {useState, useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { postReview, getReviews } from '../../store/reviews'
import { useSelector, useDispatch } from 'react-redux'


const ReviewForm = () => {
    const {projectId} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    const [review, setReview] = useState('')
    const [rating, setRating] = useState()
    const [valErrors, setValErrors] = useState([])
    const reviewerId = parseInt(user.id);

    useEffect(() => {
        const errors = []
        if (!rating) errors.push('Rate this project on a scale of 1 (awful) to 5(awesome).')
        if (!review.length) errors.push('Make sure to leave a detailed review! Your feedback could help improve this project.')
        setValErrors(errors)
    }, [review, rating])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setRating(parseInt(rating))
        const newReview = {reviewerId, review, projectId, rating}
        console.log(newReview);
        return await dispatch(postReview(newReview))
            .then(() => dispatch(getReviews()))
            .then(() => history.push(`/projects/${projectId}`))
    }

    return (
        <div id='form'>
            <form onSubmit={handleSubmit}>
                <div id='message'>
                    <i className='fa-solid fa-circle-h' style={{color: '#20AA22', height: '3vw', width: '3vw'}}></i>
                    <h1>ow did you like this project?</h1>
                </div>
                <ul>
                    {valErrors && valErrors.map((error, i) => {
                        return <li key={i}>{error}</li>
                    })}
                </ul>

                <div style={{padding: '20px', color: 'white'}}>
                    <label htmlFor='rating'>Rate this project!</label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    >
                        <option disabled label='select a rating below'></option>
                        <option value="1" label='1 (not so good)'></option>
                        <option value="2" label='2'></option>
                        <option value="3" label='3 (pretty okay)'></option>
                        <option value="4" label='4'></option>
                        <option value="5" label='5 (WHOA)'></option>
                    </select>
                </div>
                <div>
                    <label htmlFor='review'>Leave a review!</label>
                    <textarea
                        type='text'
                        id='review'
                        name='review'
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder='Tell us what you think'
                    />
                </div>
                <div id='buttons'>
                    <button type='button' onClick={() => history.goBack()}>Cancel</button>
                    <button type='submit'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default ReviewForm;
