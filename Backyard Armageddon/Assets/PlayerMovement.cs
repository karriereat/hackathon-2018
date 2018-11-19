using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;
public class PlayerMovement : MonoBehaviour
{
    [SerializeField]
    private float speed;
    [SerializeField]
    private float health;
    private bool isDead = false;
    private Vector2 direction;
    private Animator animator;
    private SpriteRenderer spriteRenderer;
    private BoxCollider boxCollider;
    private SceneManager sceneManager;
    // Use this for initialization
    void Start()
    {
        animator = GetComponent<Animator>();
        spriteRenderer = GetComponent<SpriteRenderer>();
    }

    // Update is called once per frame
    void Update()
    {
        if (!isDead)
        {
            GetInput();
            Move();
        }
    }
    void Move()
    {
        transform.Translate(direction * speed * Time.deltaTime);
    }
    private void GetInput()
    {
        direction = Vector2.zero;
        if (Input.GetKeyUp(KeyCode.W) || Input.GetKeyUp(KeyCode.A) || Input.GetKeyUp(KeyCode.S) || Input.GetKeyUp(KeyCode.D) || Input.GetKeyUp(KeyCode.UpArrow) || Input.GetKeyUp(KeyCode.LeftArrow) || Input.GetKeyUp(KeyCode.DownArrow) || Input.GetKeyUp(KeyCode.RightArrow))
        {
            animator.SetBool("walk", false);
        }
        if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow))
        {
            direction += Vector2.up;
            animator.SetBool("walk", true);
        }
        if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow))
        {
            direction += Vector2.left;
            spriteRenderer.flipX = true;
            animator.SetBool("walk", true);
        }
        if (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow))
        {
            direction += Vector2.down;
            animator.SetBool("walk", true);
        }
        if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow))
        {
            direction += Vector2.right;
            spriteRenderer.flipX = false;
            animator.SetBool("walk", true);
        }
    }
    private void Awake()
    {
        DontDestroyOnLoad(this.gameObject);
        SceneManager.sceneLoaded += OnSceneWasChanged;
    }
    public void TakeDamage(int damage)
    {
        animator.SetTrigger("playerAutsch");
        this.health = this.health - damage;
        if (this.health < 1)
        {
            this.isDead = true;
            animator.SetBool("dead", true);
            animator.SetBool("walk", false);
            StartCoroutine(showGameOverScreen());
        }

        for (int i = damage; i > 0; i--)
        {
            GameObject[] healthGems = GameObject.FindGameObjectsWithTag("Health");
            int length = healthGems.Length + 1;
            int number = length - i;
            GameObject gemObject = GameObject.Find("Health-" + number);
            if (gemObject)
            {
                Destroy(gemObject);
            }
        }
    }

    void OnSceneWasChanged(Scene scene, LoadSceneMode mode)
    {
        string sceneName = scene.name;
        string[] level = sceneName.Split('-');
        GameObject nextSpawn = GameObject.Find("Spawn-" + level[level.Length - 1]);
        transform.position = nextSpawn.transform.position;
    }

    IEnumerator showGameOverScreen()
    {
        Debug.Log("Is this waiting?");
        yield return new WaitForSeconds(2);
        SceneManager.LoadScene("Scenes/Game-Over", LoadSceneMode.Single);
    }
}