import json
import unittest
from unittest.mock import patch
from app import compare_json_files

class TestCompareJsonFiles(unittest.TestCase):
    def test_compare_json_files(self):
        json_files = ['file1.json', 'file2.json', 'file3.json']
        response_file = 'response.json'

        # Mock the open function to return the desired file contents
        with patch('builtins.open') as mock_open:
            mock_open.side_effect = [
                # Mock the contents of the 'results_good_responses%Test.json' file
                FileNotFoundError(),
                # Mock the contents of the first JSON file
                '{"key1": "value1", "key2": "value2"}',
                # Mock the contents of the response JSON file
                '{"key1": "value1", "key2": "value2"}',
                # Mock the contents of the second JSON file
                '{"key1": "value1", "key2": "value3"}',
                # Mock the contents of the response JSON file
                '{"key1": "value1", "key2": "value2"}',
                # Mock the contents of the third JSON file
                '{"key1": "value1", "key2": "value2"}',
                # Mock the contents of the response JSON file
                '{"key1": "value1", "key2": "value2"}'
            ]

            # Call the function under test
            compare_json_files(json_files, response_file)

        # Assert the expected results
        expected_results = {'key1': 100.0, 'key2': 66.66666666666666}
        with open('results_good_responses%Test.json', 'r') as f:
            actual_results = json.load(f)
        self.assertEqual(actual_results, expected_results)

if __name__ == '__main__':
    unittest.main()