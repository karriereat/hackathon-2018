using UnityEngine;
using System.Collections;

public class EnemyMovement : MonoBehaviour
{
    public float speed;
    public float aggroRange = 5;
    public int damage;
    private Transform target;
    private Animator animator;

    void Start()
    {
        animator = GetComponent<Animator>();
        target = GameObject.FindGameObjectWithTag("Player").GetComponent<Transform>();
    }

    void Update()
    {
        if (Vector2.Distance(transform.position, target.position) < aggroRange)
        {
            transform.position = Vector2.MoveTowards(transform.position, target.position, speed * Time.deltaTime);
            if (transform.position.x - target.position.x < 0)
            {
                GetComponent<SpriteRenderer>().flipX = true;
            }
            else
            {
                GetComponent<SpriteRenderer>().flipX = false;
            }
            animator.SetBool("Walk", true);
        }
        else
        {
            animator.SetBool("Walk", false);
        }
    }

    public void SetSpeed(float speed)
    {
        this.speed = speed;
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.collider.CompareTag("Player"))
        {
            collision.collider.GetComponent<PlayerMovement>().TakeDamage(damage);
        }
    }
}