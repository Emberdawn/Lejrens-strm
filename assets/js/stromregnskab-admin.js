document.addEventListener('DOMContentLoaded', () => {
	const handleDeleteConfirmation = () => {
		document.addEventListener('click', (event) => {
			const button = event.target.closest('.sr-delete-row');
			if (!button) {
				return;
			}
			const summary = button.dataset.summary || '';
			const message = summary
				? `Er du sikker på, at du vil slette denne række?\n${summary}`
				: 'Er du sikker på, at du vil slette denne række?';
			if (!window.confirm(message)) {
				event.preventDefault();
			}
		});
	};

	const handlePopupMessages = () => {
		document.querySelectorAll('.sr-popup-message').forEach((element) => {
			const message = element.dataset.message;
			if (message) {
				window.alert(message);
			}
		});
	};

	const handleResidentForm = () => {
		const form = document.getElementById('sr-resident-form');
		if (!form) {
			return;
		}
		const submitButton = document.getElementById('sr_resident_submit');
		const cancelButton = document.getElementById('sr_resident_cancel');
		const residentId = document.getElementById('sr_resident_id');
		const nameField = document.getElementById('name');
		const memberField = document.getElementById('member_number');
		const userField = document.getElementById('wp_user_id');
		const defaultLabel = submitButton ? submitButton.value : '';

		document.querySelectorAll('.sr-fill-resident').forEach((button) => {
			button.addEventListener('click', () => {
				nameField.value = button.dataset.name || '';
				memberField.value = button.dataset.memberNumber || '';
				userField.value = button.dataset.wpUserId || '';
				residentId.value = button.dataset.residentId || '';
				if (submitButton) {
					submitButton.value = 'Gem';
				}
				if (cancelButton) {
					cancelButton.classList.remove('sr-hidden');
				}
			});
		});

		if (cancelButton) {
			cancelButton.addEventListener('click', () => {
				form.reset();
				residentId.value = '';
				if (submitButton) {
					submitButton.value = defaultLabel;
				}
				cancelButton.classList.add('sr-hidden');
			});
		}
	};

	const handleReadingForm = () => {
		const form = document.getElementById('sr-reading-form');
		if (!form) {
			return;
		}
		const submitButton = document.getElementById('sr_reading_submit');
		const cancelButton = document.getElementById('sr_reading_cancel');
		const readingId = document.getElementById('sr_reading_id');
		const residentField = document.getElementById('sr_reading_resident');
		const monthField = document.getElementById('sr_reading_month');
		const yearField = document.getElementById('sr_reading_year');
		const readingField = document.getElementById('sr_reading_value');
		const verifiedField = document.getElementById('sr_reading_verified');
		const defaultLabel = submitButton ? submitButton.value : '';
		const currentMonth = form.dataset.currentMonth || '';
		const currentYear = form.dataset.currentYear || '';

		document.querySelectorAll('.sr-fill-reading').forEach((button) => {
			button.addEventListener('click', () => {
				residentField.value = button.dataset.residentId || '';
				monthField.value = button.dataset.periodMonth || currentMonth;
				yearField.value = button.dataset.periodYear || currentYear;
				readingField.value = button.dataset.readingKwh || '';
				readingId.value = button.dataset.readingId || '';
				if (verifiedField) {
					verifiedField.checked = button.dataset.status === 'verified';
				}
				if (submitButton) {
					submitButton.value = 'Gem';
				}
				if (cancelButton) {
					cancelButton.classList.remove('sr-hidden');
				}
			});
		});

		if (cancelButton) {
			cancelButton.addEventListener('click', () => {
				form.reset();
				readingId.value = '';
				residentField.value = '';
				monthField.value = currentMonth;
				yearField.value = currentYear;
				if (verifiedField) {
					verifiedField.checked = false;
				}
				if (submitButton) {
					submitButton.value = defaultLabel;
				}
				cancelButton.classList.add('sr-hidden');
			});
		}
	};

	const handlePaymentForm = () => {
		const form = document.getElementById('sr-payment-form');
		if (!form) {
			return;
		}
		const submitButton = document.getElementById('sr_payment_submit');
		const cancelButton = document.getElementById('sr_payment_cancel');
		const paymentId = document.getElementById('sr_payment_id');
		const residentField = document.getElementById('sr_payment_resident');
		const monthField = document.getElementById('sr_payment_month');
		const yearField = document.getElementById('sr_payment_year');
		const amountField = document.getElementById('sr_payment_amount');
		const verifiedField = document.getElementById('sr_payment_verified');
		const bankStatementField = document.getElementById('sr_payment_bank_statement');
		const defaultLabel = submitButton ? submitButton.value : '';
		const currentMonth = form.dataset.currentMonth || '';
		const currentYear = form.dataset.currentYear || '';

		const updateAmountFromStatement = (statementField) => {
			if (!statementField || !amountField) {
				return;
			}
			const selectedOption = statementField.options[statementField.selectedIndex];
			if (!selectedOption) {
				return;
			}
			const optionAmount = selectedOption.dataset.amount;
			if (optionAmount) {
				amountField.value = optionAmount;
			}
		};

		document.querySelectorAll('.sr-fill-payment').forEach((button) => {
			button.addEventListener('click', () => {
				residentField.value = button.dataset.residentId || '';
				monthField.value = button.dataset.periodMonth || currentMonth;
				yearField.value = button.dataset.periodYear || currentYear;
				amountField.value = button.dataset.amount || '';
				paymentId.value = button.dataset.paymentId || '';
				if (verifiedField) {
					verifiedField.checked = button.dataset.status === 'verified';
				}
				if (bankStatementField) {
					const bankStatementId = button.dataset.bankStatementId || '';
					const bankStatementLabel = button.dataset.bankStatementLabel || '';
					const bankStatementAmount = button.dataset.bankStatementAmount || '';
					if (bankStatementId) {
						let option = bankStatementField.querySelector(`option[value="${bankStatementId}"]`);
						if (!option && bankStatementLabel) {
							option = document.createElement('option');
							option.value = bankStatementId;
							option.textContent = bankStatementLabel;
							if (bankStatementAmount) {
								option.dataset.amount = bankStatementAmount;
							}
							bankStatementField.appendChild(option);
						}
						bankStatementField.value = bankStatementId;
					} else {
						bankStatementField.value = '';
					}
				}
				if (submitButton) {
					submitButton.value = 'Gem';
				}
				if (cancelButton) {
					cancelButton.classList.remove('sr-hidden');
				}
			});
		});

		if (cancelButton) {
			cancelButton.addEventListener('click', () => {
				form.reset();
				paymentId.value = '';
				residentField.value = '';
				monthField.value = currentMonth;
				yearField.value = currentYear;
				if (verifiedField) {
					verifiedField.checked = false;
				}
				if (bankStatementField) {
					bankStatementField.value = '';
				}
				if (submitButton) {
					submitButton.value = defaultLabel;
				}
				cancelButton.classList.add('sr-hidden');
			});
		}

		if (bankStatementField) {
			bankStatementField.addEventListener('change', () => {
				updateAmountFromStatement(bankStatementField);
			});
		}
	};

	const handleBankLinking = () => {
		const hideNegativeToggle = document.querySelector('input[type="checkbox"][name="sr_hide_negative"]');
		if (hideNegativeToggle && hideNegativeToggle.form) {
			hideNegativeToggle.addEventListener('change', () => {
				hideNegativeToggle.form.submit();
			});
		}

		document.querySelectorAll('.sr-link-payment-row').forEach((row) => {
			const memberSelect = row.querySelector('.sr-link-payment-member');
			const nameSelect = row.querySelector('.sr-link-payment-name');

			if (!memberSelect || !nameSelect) {
				return;
			}

			const syncSelects = (source, target) => {
				target.value = source.value || '';
			};

			memberSelect.addEventListener('change', () => {
				syncSelects(memberSelect, nameSelect);
			});

			nameSelect.addEventListener('change', () => {
				syncSelects(nameSelect, memberSelect);
			});
		});
	};

	handleDeleteConfirmation();
	handlePopupMessages();
	handleResidentForm();
	handleReadingForm();
	handlePaymentForm();
	handleBankLinking();
});
