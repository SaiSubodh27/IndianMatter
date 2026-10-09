"""
parents.py - Idealised parent structures for universal doping workflow testing.

Covers:
  - Perovskite: SrTiO3 (cubic Pm-3m, a=3.905 A)
  - Rocksalt: MgO (cubic Fm-3m, a=4.21 A)
  - Fluorite: CeO2 (cubic Fm-3m, a=5.41 A)
  - Rutile: TiO2 (tetragonal P4_2/mnm, a=4.593 A, c=2.959 A)
  - Wurtzite: ZnO (hexagonal P6_3mc, a=3.25 A, c=5.20 A)
  - Diamond: Si (cubic Fd-3m, a=5.43 A)
  - Metal: Cu (FCC Fm-3m, a=3.615 A)
  - Garnet: Y3Al5O12 (cubic Ia-3d, a=12.01 A, Al on CN6 and CN4 sites)
  - Spinel: MgAl2O4 (cubic Fd-3m:2, a=8.08 A, Mg on CN4, Al on CN6)
  - Molecular: CO2 (dry ice, cubic Pa-3, a=5.58 A)
  - Disordered: SrTiO3 with partial occupancies (to test refusal gate)
"""

from __future__ import annotations
from typing import Dict, Any, Optional
import numpy as np
from pymatgen.core import Structure, Lattice, PeriodicSite


def get_parent(name: str) -> Structure:
    """Retrieve an idealised parent structure by name."""
    name_clean = name.strip()
    
    if name_clean in ("SrTiO3", "STO"):
        return Structure.from_spacegroup(
            "Pm-3m", Lattice.cubic(3.905),
            ["Sr", "Ti", "O"],
            [[0.0, 0.0, 0.0], [0.5, 0.5, 0.5], [0.5, 0.5, 0.0]]
        )
    
    elif name_clean == "MgO":
        return Structure.from_spacegroup(
            "Fm-3m", Lattice.cubic(4.21),
            ["Mg", "O"],
            [[0.0, 0.0, 0.0], [0.5, 0.5, 0.5]]
        )
    
    elif name_clean == "CeO2":
        return Structure.from_spacegroup(
            "Fm-3m", Lattice.cubic(5.41),
            ["Ce", "O"],
            [[0.0, 0.0, 0.0], [0.25, 0.25, 0.25]]
        )
    
    elif name_clean == "TiO2":
        return Structure.from_spacegroup(
            "P4_2/mnm", Lattice.tetragonal(4.593, 2.959),
            ["Ti", "O"],
            [[0.0, 0.0, 0.0], [0.305, 0.305, 0.0]]
        )
    
    elif name_clean == "ZnO":
        return Structure.from_spacegroup(
            "P6_3mc", Lattice.hexagonal(3.25, 5.20),
            ["Zn", "O"],
            [[1/3, 2/3, 0.0], [1/3, 2/3, 0.382]]
        )
    
    elif name_clean == "Si":
        return Structure.from_spacegroup(
            "Fd-3m", Lattice.cubic(5.43),
            ["Si"],
            [[0.125, 0.125, 0.125]]
        )
    
    elif name_clean == "Cu":
        return Structure.from_spacegroup(
            "Fm-3m", Lattice.cubic(3.615),
            ["Cu"],
            [[0.0, 0.0, 0.0]]
        )
    
    elif name_clean in ("Y3Al5O12", "YAG"):
        # YAG: Y on 24c (CN8), Al on 16a (CN6) and 24d (CN4), O on 96h
        return Structure.from_spacegroup(
            "Ia-3d", Lattice.cubic(12.01),
            ["Y", "Al", "Al", "O"],
            [
                [0.125, 0.0, 0.25],       # 24c (Y, CN=8)
                [0.0, 0.0, 0.0],           # 16a (Al, CN=6 octahedral)
                [0.375, 0.0, 0.25],        # 24d (Al, CN=4 tetrahedral)
                [0.032, 0.053, 0.651]      # 96h (O)
            ]
        )
    
    elif name_clean == "MgAl2O4":
        # Spinel origin 2: Mg on 8a (CN=4), Al on 16d (CN=6), O on 32e
        return Structure.from_spacegroup(
            "Fd-3m:2", Lattice.cubic(8.08),
            ["Mg", "Al", "O"],
            [
                [0.125, 0.125, 0.125],     # 8a (Mg tet, CN=4)
                [0.5, 0.5, 0.5],           # 16d (Al oct, CN=6)
                [0.263, 0.263, 0.263]      # 32e (O)
            ]
        )
    
    elif name_clean in ("CO2", "dry_ice"):
        # Molecular crystal: Pa-3, C on 4a (0,0,0), O on 8c (u,u,u)
        return Structure.from_spacegroup(
            "Pa-3", Lattice.cubic(5.58),
            ["C", "O"],
            [[0.0, 0.0, 0.0], [0.115, 0.115, 0.115]]
        )
    
    elif name_clean in ("SrTiO3_disordered", "disordered_STO"):
        # Create a disordered structure with partial occupancies on Sr site
        latt = Lattice.cubic(3.905)
        s = Structure(
            latt,
            [{"Sr": 0.8, "Ba": 0.2}, "Ti", "O", "O", "O"],
            [
                [0.0, 0.0, 0.0],
                [0.5, 0.5, 0.5],
                [0.5, 0.5, 0.0],
                [0.5, 0.0, 0.5],
                [0.0, 0.5, 0.5]
            ]
        )
        return s
    
    else:
        raise ValueError(f"Unknown test parent: {name}")
