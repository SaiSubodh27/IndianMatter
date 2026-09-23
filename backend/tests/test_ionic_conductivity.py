import unittest
from pathlib import Path
from pymatgen.core import Structure, Lattice
import model_service
from properties.ionic_conductivity import IonicConductivityCalculator


class TestIonicConductivity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        model_service.load_models()

    def setUp(self):
        self.cif_path = Path("backend/demo_datasets/batch_cifs/LLZO_cubic_demo.cif")
        if not self.cif_path.exists():
            self.cif_path = Path("demo_datasets/batch_cifs/LLZO_cubic_demo.cif")
        self.structure = Structure(Lattice.cubic(4.0), ["Li", "O"], [[0, 0, 0], [0.5, 0.5, 0.5]])

    def test_predict_from_cif(self):
        if self.cif_path.exists():
            res = model_service.predict_from_cif(str(self.cif_path), temperature=298.15)
            self.assertEqual(res["status"], "success")
            self.assertGreater(res["Ea"], 0.1)
            self.assertLess(res["Ea"], 2.0)
            self.assertGreater(res["conductivity"], 0.0)
            self.assertIn("coverage_pct", res["feature_coverage"])
            self.assertGreater(res["feature_coverage"]["coverage_pct"], 50.0)

    def test_calculator_property_result(self):
        calc = IonicConductivityCalculator()
        res = calc.calculate(self.structure, settings={"temperature_k": 298.15})
        self.assertEqual(res.status, "calculated")
        self.assertIsNotNone(res.value)
        self.assertEqual(res.unit, "mS/cm")
        self.assertIn("activation_energy_ev", res.raw_details)


if __name__ == "__main__":
    unittest.main()
