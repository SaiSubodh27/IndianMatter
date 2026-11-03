"""
Number formatting helpers shared by the pipeline and the API layer.

Project-wide display rule
-------------------------
Dopant fractions and other site-occupancy numbers are reported to **two decimal
places only** (e.g. 0.8889 -> 0.89). Full precision is deliberately retained
*internally* - rounding the values that drive charge bookkeeping or supercell
construction would silently change the chemistry (0.8889 and 0.89 describe
different numbers of atoms). Formatting and arithmetic are therefore kept
strictly separate: this module formats, nothing here feeds back into a Structure.
"""

from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP

# Number of decimals used whenever a fraction/occupancy is shown to a human.
DISPLAY_DECIMALS = 2


def round_display(value, decimals: int = DISPLAY_DECIMALS):
    """Round ``value`` to ``decimals`` places for *display only*.

    Uses **half-up** rounding, not Python's built-in banker's rounding. This
    matters: ``round(0.015, 2)`` returns ``0.01`` and ``round(0.125, 2)`` returns
    ``0.12`` because Python rounds a tie to the nearest *even* digit. Reporting a
    1.5% dopant as 1.2% understates it, so ties are rounded away from zero here
    to match what a reader expects from "two decimals".

    Returns None unchanged so optional fields stay optional, and never raises on
    unexpected input - a formatting helper must not be able to fail a pipeline run.
    """
    if value is None:
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return value
    # Decimal(str(...)) rather than Decimal(number): going through the shortest
    # repr avoids binary-float artefacts such as 0.145 -> 0.14499999.
    quantum = Decimal(1).scaleb(-decimals)
    return float(Decimal(str(number)).quantize(quantum, rounding=ROUND_HALF_UP))


def format_amount(value, decimals: int = DISPLAY_DECIMALS) -> str:
    """Render a per-formula-unit amount (e.g. a site population) as a fixed-decimal string.

    Uses :func:`round_display` internally, so it inherits the half-up tie rule.
    An f-string like ``f"{0.125:.2f}"`` would NOT: it rounds half-to-even and
    yields "0.12". Build the string from the already-rounded value instead.
    """
    rounded = round_display(value, decimals)
    if rounded is None or isinstance(rounded, str):
        return "?"
    return f"{rounded:.{decimals}f}"


def format_percent(value, decimals: int = DISPLAY_DECIMALS) -> str:
    """Render a 0-1 fraction as a percentage string (e.g. 0.8889 -> "88.89%").

    Uses :func:`round_display` so ties follow half-up, not half-to-even.
    """
    if value is None:
        return "?"
    try:
        scaled = float(value) * 100.0
    except (TypeError, ValueError):
        return "?"
    rounded = round_display(scaled, decimals)
    if rounded is None or isinstance(rounded, str):
        return "?"
    return f"{rounded:.{decimals}f}%"


def format_float(value, decimals: int = DISPLAY_DECIMALS) -> str:
    """Render a float with fixed decimals, or "?" when unavailable. Half-up ties."""
    return format_amount(value, decimals)
