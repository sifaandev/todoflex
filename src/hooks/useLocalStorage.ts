import React, { useState, useEffect } from 'react';

export default function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  	const [state, setState] = useState<T>(() => {
	 	const item = localStorage.getItem(key)

	 	if (item) {
	 		return JSON.parse(item)
	 	} else {
	 		return initialValue
	 	}
	});

	useEffect(() => {
	  localStorage.setItem(key, JSON.stringify(state))
	}, [key, state]);

	return [state, setState]
}