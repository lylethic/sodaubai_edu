'use client';

import React, { useState, useEffect } from 'react';

interface DropdownSearchSelectInputProps {
	options: string[]; // Dropdown options
	placeholder?: string;
	onChange: (value: string) => void; // Callback to return the final input value
}

export default function DropdownSearchSelectInput({
	options,
	placeholder = 'Type, search, or select...',
	onChange,
}: DropdownSearchSelectInputProps) {
	const [inputValue, setInputValue] = useState('');
	const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// Filter dropdown options dynamically based on the input value
	useEffect(() => {
		if (inputValue.trim() === '') {
			setFilteredOptions(options);
		} else {
			setFilteredOptions(
				options.filter((option) =>
					option.toLowerCase().includes(inputValue.toLowerCase())
				)
			);
		}
	}, [inputValue, options]);

	// Handle input change
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		setIsDropdownOpen(true);
		onChange(value); // Return the typed value
	};

	// Handle option select from the dropdown
	const handleOptionSelect = (value: string) => {
		setInputValue(value); // Set the selected option in the input
		setIsDropdownOpen(false); // Close dropdown
		onChange(value); // Return the selected value
	};

	return (
		<div className='relative w-full max-w-md'>
			{/* Input Field */}
			<input
				type='text'
				value={inputValue}
				placeholder={placeholder}
				onChange={handleInputChange}
				onFocus={() => setIsDropdownOpen(true)} // Open dropdown on focus
				className='w-full border border-gray-300 rounded-md p-2'
			/>

			{/* Dropdown Menu */}
			{isDropdownOpen && filteredOptions.length > 0 && (
				<ul className='absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-md'>
					{filteredOptions.map((option, index) => (
						<li
							key={index}
							onClick={() => handleOptionSelect(option)}
							className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
						>
							{option}
						</li>
					))}
				</ul>
			)}

			{/* Dropdown Empty State */}
			{isDropdownOpen && filteredOptions.length === 0 && (
				<div className='absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 p-2 text-gray-500 shadow-md'>
					No options found.
				</div>
			)}
		</div>
	);
}
