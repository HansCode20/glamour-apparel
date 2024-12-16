import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { clearCartWithoutNotification } from '../../Features/CartSlice'

const Cancel = (isPaymentCanceled) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  

  useEffect(() => {
    if (isPaymentCanceled) {
      navigate('/')
    } else {
      dispatch(clearCartWithoutNotification())
    }
  }, [isPaymentCanceled,navigate ,dispatch])

}

export default Cancel