import React from 'react'

export default function Button({ children, disabled, loading, ...other }) {
    return (
        <button
            disabled={disabled || loading}
            {...other}
            className={`my-3 text-lg font-bold py-2 px-5 border-2 rounded-md ${
                disabled ? 'border-gray-accent-light text-gray' : 'bg-red text-white border-red'
            }`}
        >
            {loading ? 'Submitting...' : children}
        </button>
    )
}
