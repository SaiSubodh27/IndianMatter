from typing import Dict, Optional, List
from models.base_adapter import BaseModelAdapter
from models.m3gnet_adapter import M3GNetAdapter
from models.chgnet_adapter import CHGNetAdapter
from models.mace_adapter import MACEAdapter
from core.device_manager import get_device_info

class ModelRegistry:
    """
    Central registry for managing atomistic ML model adapters.
    """
    def __init__(self):
        self.adapters: Dict[str, BaseModelAdapter] = {
            "m3gnet": M3GNetAdapter(),
            "chgnet": CHGNetAdapter(),
            "mace": MACEAdapter(),
        }

    def get_adapter(self, model_key: str) -> Optional[BaseModelAdapter]:
        key = model_key.lower().strip()
        return self.adapters.get(key)

    def get_all_statuses(self) -> Dict[str, dict]:
        statuses = {}
        for key, adapter in self.adapters.items():
            valid, msg = adapter.validate_model_installation()
            meta = adapter.get_model_metadata()
            statuses[key] = {
                "key": key,
                "name": adapter.display_name,
                "available": valid,
                "loaded": adapter.is_loaded,
                "device": adapter.device,
                "capabilities": meta.get("capabilities", []),
                "error": None if valid else msg,
            }
        return statuses

    def get_capabilities(self) -> dict:
        device_info = get_device_info()
        return {
            "models": self.get_all_statuses(),
            "device": device_info,
        }

    def unload_all(self):
        for adapter in self.adapters.values():
            if adapter.is_loaded:
                adapter.unload_model()

model_registry = ModelRegistry()
