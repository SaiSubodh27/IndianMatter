import unittest
from pymatgen.core import Structure, Lattice
from properties.property_registry import property_registry
from properties.electrical_properties import ExcludedIonicConductivityCalculator, ExcludedActivationEnergyCalculator

class TestPropertyCalculators(unittest.TestCase):
    def setUp(self):
        self.structure = Structure(Lattice.cubic(4.0), ["Li", "O"], [[0,0,0], [0.5,0.5,0.5]])

    def test_excluded_properties(self):
        ic_calc = ExcludedIonicConductivityCalculator()
        res_ic = ic_calc.calculate(self.structure)
        self.assertEqual(res_ic.status, "unsupported")
        self.assertIsNone(res_ic.value)
        self.assertIn("excluded and unsupported", res_ic.warnings[0])

        ea_calc = ExcludedActivationEnergyCalculator()
        res_ea = ea_calc.calculate(self.structure)
        self.assertEqual(res_ea.status, "unsupported")
        self.assertIsNone(res_ea.value)

    def test_composition_descriptors(self):
        calc = property_registry.get_calculator("composition_descriptors")
        res = calc.calculate(self.structure)
        self.assertEqual(res.status, "calculated")
        self.assertEqual(res.value["num_elements"], 2)
        self.assertIn("average_atomic_mass_amu", res.value)

    def test_structural_descriptors(self):
        calc = property_registry.get_calculator("structural_descriptors")
        res = calc.calculate(self.structure)
        self.assertEqual(res.status, "calculated")
        self.assertEqual(res.value["volume_ang3"], 64.0)
        self.assertEqual(res.value["num_sites"], 2)

if __name__ == "__main__":
    unittest.main()
