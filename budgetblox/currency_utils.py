CURRENCY_SYMBOLS = {
    'GBP': '£',
    'USD': '$',
    'EUR': '€',
    'CNY': '¥',
    'JPY': '¥',
    'BTC': '₿',
    'INR': '₹',
    'RUB': '₽',
    'SGD': '$',
    'KRW': '₩',
    'VND': '₫',
    'AUD': '$',
    'CAD': '$',
    'ILS': '₪',
    'NGN': '₦',
    'DKK': 'kr',
    'ETB': 'Br',
    'TRY': '₺',
    'DZD': 'DA',
    'MRU': 'UM',
    'MAD': 'DM',
    'JOD': 'JD',
    'XCD': '$',
    'GHS': '₵',
    'BND': '$',
    'HKD': '$',
    'CHF': 'Fr',
    'ANG': 'ƒ',
    'SHP': '£',
    'FKP': '£'
}

def get_currency_symbol(currency_code):
    return CURRENCY_SYMBOLS.get(currency_code, currency_code)

def format_currency(amount, currency_code):
    symbol = get_currency_symbol(currency_code)
    return f"{symbol} {amount:.2f} {currency_code}"