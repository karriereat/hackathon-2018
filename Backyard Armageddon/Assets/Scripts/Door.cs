using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;

public class Door : MonoBehaviour {

    Scene activeScene;
    Vector3 tempPos;

    [SerializeField] private int level;
    [SerializeField] private float xPosition;
    [SerializeField] private float yPosition;

    // Use this for initialization
    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player")) {
            Debug.Log("Scenes/Level-" + level);
            SceneManager.LoadScene("Scenes/Level-" + level, LoadSceneMode.Additive);
        }
    }
}
