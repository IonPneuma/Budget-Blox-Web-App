import locale

def format_currency(value, currency):
    try:
        locale.setlocale(locale.LC_ALL, '')
        currency_value = locale.currency(value, grouping=True)
    except:
        currency_value = f"{value} {currency}"
    return currency_value